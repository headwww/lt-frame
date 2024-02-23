<template>
	<Modal v-bind="getBindValue" @cancel="handleCancel">
		<template #closeIcon v-if="!$slots.closeIcon">
			<ModalClose
				:can-fullscreen="getProps.canFullscreen"
				:fullScreen="getProps.fullScreenRef"
				@cancel="handleCancel"
				@fullscreen="handleFullScreen"
			/>
		</template>

		<template #title v-if="!$slots.title">
			<ModalTitle
				:title="getMergeProps.title"
				:sub-title="getProps.subTitle"
				:tip="getProps.tip"
			></ModalTitle>
		</template>

		<template #footer v-if="!$slots.footer">
			<ModalFooter v-bind="getBindValue" @ok="handleOk" @cancel="handleCancel">
				<template #[item]="data" v-for="item in Object.keys($slots)">
					<slot :name="item" v-bind="data || {}"></slot>
				</template>
			</ModalFooter>
		</template>
		<ModalWrapper
			ref="modalWrapperRef"
			:footerOffset="wrapperFooterOffset"
			:fullScreen="fullScreenRef"
			:loading="getProps.loading"
			:loading-tip="getProps.loadingTip"
			:open="openRef"
			:minHeight="getProps.minHeight"
			:height="getWrapperHeight"
			:modalFooterHeight="footer !== undefined && !footer ? 0 : undefined"
			:is-sub-title="subTitle !== undefined && !subTitle ? true : false"
			v-bind="
				omit(getProps.wrapperProps, 'open', 'height', 'modalFooterHeight')
			"
			@height-change="handleHeightChange"
		>
			<slot></slot>
		</ModalWrapper>

		<template
			#[item]="data"
			v-for="item in Object.keys(omit($slots, 'default'))"
		>
			<slot :name="item" v-bind="data || {}"></slot>
		</template>
	</Modal>
</template>

<script lang="ts" setup>
import {
	computed,
	getCurrentInstance,
	nextTick,
	ref,
	toRef,
	unref,
	watch,
	watchEffect,
} from 'vue';
import { isFunction, omit } from 'lodash-es';
import { useAttrs } from '@lt-frame/hooks';
import { Recordable, deepMerge } from '@lt-frame/utils';
import Modal from './components/basic-modal';
import ModalTitle from './components/modal-title.vue';
import ModalClose from './components/modal-close.vue';
import ModalFooter from './components/modal-footer.vue';
import ModalWrapper from './components/modal-wrapper.vue';
import { basicProps, BaseModalProps } from './components/base-modal';
import { ModalWrapperInstance } from './components/modal-wrapper';
import { ModalMethods } from './typing';
import { useFullScreen } from './hooks/useModalFullScreen';

defineOptions({
	name: 'LTModal',
	inheritAttrs: false,
});

const props = defineProps(basicProps);
const emit = defineEmits([
	'open-change',
	'height-change',
	'cancel',
	'register',
	'ok',
	'update:open',
]);
const attrs = useAttrs();
const propsRef = ref<Partial<BaseModalProps> | null>(null);
const openRef = ref(false);
const modalWrapperRef = ref<ModalWrapperInstance>();
const modalMethods: ModalMethods = {
	setModalProps,
	emitOpen: undefined,
	redoModalHeight: () => {
		nextTick(() => {
			if (unref(modalWrapperRef)) {
				unref(modalWrapperRef)?.setContentHeight();
			}
		});
	},
};

const instance = getCurrentInstance();
if (instance) {
	emit('register', modalMethods, instance.uid);
}

// 处理父组件传递进来的参数和函数方式传递进来的属性进行合并
const getMergeProps = computed(
	(): Recordable => ({
		...props,
		...(unref(propsRef) as any),
	})
);

// 生成 modal 的最终配置参数 不考虑 okButtonProps、cancelButtonProps和title
const getProps = computed((): Recordable => {
	const opt = {
		...unref(getMergeProps),
		open: unref(openRef),
		okButtonProps: undefined,
		cancelButtonProps: undefined,
		title: undefined,
	};
	return {
		...opt,
		wrapClassName: unref(getWrapClassName),
	};
});

const getBindValue = computed(() => {
	const attr = {
		...attrs,
		...unref(getMergeProps),
		open: unref(openRef),
	} as any;
	// ant提供的对话框外层容器的类名
	attr.wrapClassName =
		// eslint-disable-next-line no-useless-concat
		`${attr?.wrapClassName || ''} ${unref(getWrapClassName)}` + 'lt-modal-wrap';

	if (unref(fullScreenRef)) {
		return omit(attr, ['height', 'title']);
	}
	return omit(attr, 'title');
});

// 处理全屏功能
const { fullScreenRef, handleFullScreen, getWrapClassName } = useFullScreen(
	toRef(getMergeProps.value, 'wrapClassName')
);

const getWrapperHeight = computed(() => {
	if (unref(fullScreenRef)) return undefined;
	return unref(getProps).height;
});

watchEffect(() => {
	openRef.value = !!props.open;
	fullScreenRef.value = !!props.defaultFullscreen;
});

watch(
	() => unref(openRef),
	(v) => {
		// 通知父组件绑定的参数更新
		emit('open-change', v);
		emit('update:open', v);
		instance && modalMethods.emitOpen?.(v, instance.uid);
		nextTick(() => {
			if (props.scrollTop && v && unref(modalWrapperRef)) {
				unref(modalWrapperRef)?.scrollTop();
			}
		});
	},
	{
		immediate: false,
	}
);

/**
 * 关闭modal
 * @param e
 */
async function handleCancel(e: Event) {
	e?.stopPropagation();
	// 没有过滤掉自定义关闭按钮的空白区域
	if ((e.target as HTMLElement)?.classList?.contains('lt-modal-close--custom'))
		return;
	// 关闭前执行，返回 true 则关闭，否则不关闭
	if (props.closeFunc && isFunction(props.closeFunc)) {
		const isClose: boolean = await props.closeFunc();
		openRef.value = !isClose;
		return;
	}
	// 默认行为，在组件内部处理关闭
	openRef.value = false;
	emit('cancel', e);
}

function setModalProps(props: Partial<BaseModalProps>) {
	propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
	if (Reflect.has(props, 'open')) {
		openRef.value = !!props.open;
	}
	if (Reflect.has(props, 'defaultFullscreen')) {
		fullScreenRef.value = !!props.defaultFullscreen;
	}
}

function handleOk(e: Event) {
	emit('ok', e);
}

function handleHeightChange(height: string) {
	emit('height-change', height);
}
</script>
