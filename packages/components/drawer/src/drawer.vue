<template>
	<Drawer @close="onClose" v-bind="getBindValues">
		<template #title v-if="!$slots.title">
			<DrawerHeader
				:isDetail="isDetail"
				:title="getMergeProps.title"
				:showDetailBack="showDetailBack"
				@close="onClose"
			>
				<template #titleToolbar>
					<slot name="titleToolbar"></slot>
				</template>
			</DrawerHeader>
		</template>
		<template v-else #title>
			<slot name="title"></slot>
		</template>

		<LTScrollbar
			:style="getScrollContentStyle"
			v-loading="getLoading"
			:loading-tip="loadingText || '加载中...'"
		>
			<slot></slot>
		</LTScrollbar>

		<DrawerFooter
			v-bind="getProps"
			@close="onClose"
			@ok="handleOk"
			:height="getFooterHeight"
		>
			<template #[item]="data" v-for="item in Object.keys($slots)">
				<slot :name="item" v-bind="data || {}"></slot>
			</template>
		</DrawerFooter>
	</Drawer>
</template>

<script lang="ts" setup>
import { Drawer } from 'ant-design-vue';
import { Loading as vLoading } from '@lt-frame/directives';
import {
	getCurrentInstance,
	computed,
	toRaw,
	unref,
	ref,
	nextTick,
	watch,
	CSSProperties,
} from 'vue';
import { useAttrs } from '@lt-frame/hooks';
import { deepMerge, isFunction, isNumber } from '@lt-frame/utils';
import DrawerHeader from './drawer-header.vue';
import DrawerFooter from './drawer-footer.vue';
import LTScrollbar from '../../scrollbar';
import { drawerProps, DrawerInstance, DrawerProps } from './drawer';

defineOptions({ name: 'LTDrawer', inheritAttrs: false });
const emit = defineEmits(['open-change', 'ok', 'close', 'register']);
const props = defineProps(drawerProps);
const drawerInstance: DrawerInstance = {
	setDrawerProps: setDrawerProps as any,
	emitOpen: undefined,
};

const instance = getCurrentInstance();

instance && emit('register', drawerInstance, instance.uid);

const attrs = useAttrs();

const openRef = ref(false);

const propsRef = ref<Partial<DrawerProps | null>>(null);

const getMergeProps = computed(
	(): DrawerProps => deepMerge(toRaw(props), unref(propsRef)) as any
);

const getProps = computed((): DrawerProps => {
	const opt = {
		placement: 'right',
		...unref(attrs),
		...unref(getMergeProps),
		open: unref(openRef),
	};
	opt.title = undefined;
	const { isDetail, width, maskStyle } = opt;
	if (isDetail) {
		if (!width) {
			opt.width = '100%';
		}
	}
	if (!maskStyle) {
		opt.maskStyle = { 'background-color': 'transparent' };
	}
	return opt as any;
});

const getFooterHeight = computed(() => {
	const { footerHeight, showFooter } = unref(getProps);
	if (showFooter && footerHeight) {
		return isNumber(footerHeight)
			? `${footerHeight}px`
			: `${footerHeight.replace('px', '')}px`;
	}
	return `0px`;
});

const getScrollContentStyle = computed((): CSSProperties => {
	const footerHeight = unref(getFooterHeight);
	return {
		position: 'relative',
		height: `calc(100% - ${footerHeight})`,
	};
});

const getLoading = computed(() => !!unref(getProps)?.loading);

const getBindValues = computed(
	(): DrawerProps => ({ ...attrs, ...unref(getProps) })
);

watch(
	() => props.open,
	(newVal, oldVal) => {
		if (newVal !== oldVal) openRef.value = newVal;
	},
	{ deep: true }
);

watch(
	() => openRef.value,
	(open) => {
		nextTick(() => {
			emit('open-change', open);
			instance && drawerInstance.emitOpen?.(open, instance.uid);
		});
	}
);

async function onClose(e: any) {
	const { closeFunc } = unref(getProps);
	emit('close', e);
	if (closeFunc && isFunction(closeFunc)) {
		const res = await closeFunc();
		openRef.value = !res;
		return;
	}
	openRef.value = false;
}

function setDrawerProps(props: Partial<DrawerProps>): void {
	propsRef.value = deepMerge(unref(propsRef) || ({} as any), props);
	if (Reflect.has(props, 'open')) {
		openRef.value = !!props.open;
	}
}

function handleOk() {
	emit('ok');
}
</script>
