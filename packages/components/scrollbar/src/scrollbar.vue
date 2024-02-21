<template>
	<div :class="ns.b()" ref="scrollbarRef">
		<div
			ref="wrapRef"
			:class="wrapKls"
			:style="wrapStyle"
			@scroll="handleScroll"
		>
			<component
				ref="resizeRef"
				:is="tag"
				:id="id"
				:class="resizeKls"
				:style="viewStyle"
				:role="role"
				:aria-label="ariaLabel"
				:aria-orientation="ariaOrientation"
			>
				<slot></slot>
			</component>
			<template v-if="!native">
				<Bar
					ref="barRef"
					:height="sizeHeight"
					:width="sizeWidth"
					:always="always"
					:ratio-x="ratioX"
					:ratio-y="ratioY"
				/>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	StyleValue,
	computed,
	CSSProperties,
	provide,
	ref,
	reactive,
	onMounted,
	nextTick,
	onUpdated,
	watch,
	unref,
} from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { isNumber, isObject } from 'lodash-es';
import { useScrollTo, useNamespace } from '@lt-frame/hooks';
import { addUnit, debugWarn } from '@lt-frame/utils';
import Bar from './bar.vue';
import { scrollbarContextKey } from './constants';
import { GAP } from './util';
import { scrollbarProps, scrollbarEmits } from './scrollbar';
import { BarInstance } from './bar';

const ns = useNamespace('scrollbar');

const COMPONENT_NAME = 'LTScrollbar';
defineOptions({
	name: COMPONENT_NAME,
});
const props = defineProps(scrollbarProps);
const emit = defineEmits(scrollbarEmits);

// 用于停止监听器的函数
let stopResizeObserver: (() => void) | undefined;
let stopResizeListener: (() => void) | undefined;

// 引用DOM元素
const scrollbarRef = ref<HTMLDivElement>();
const wrapRef = ref<HTMLDivElement>();
const resizeRef = ref<HTMLElement>();
const barRef = ref<BarInstance>();

const sizeWidth = ref('0');
const sizeHeight = ref('0');
const ratioY = ref(1);
const ratioX = ref(1);

const wrapStyle = computed<StyleValue>(() => {
	const style: CSSProperties = {};
	if (props.height) style.height = addUnit(props.height);
	if (props.maxHeight) style.maxHeight = addUnit(props.maxHeight);
	return [props.wrapStyle, style];
});

const wrapKls = computed(() => [
	props.wrapClass,
	ns.e('wrap'),
	{ [ns.em('wrap', 'hidden-default')]: !props.native },
]);

const resizeKls = computed(() => [ns.e('view'), props.viewClass]);

const handleScroll = () => {
	if (wrapRef.value) {
		barRef.value?.handleScroll(wrapRef.value);

		emit('scroll', {
			scrollTop: wrapRef.value.scrollTop,
			scrollLeft: wrapRef.value.scrollLeft,
		});
	}
};

// @ts-nocheck
function scrollTo(xCord: number, yCord?: number): void;
function scrollTo(options: ScrollToOptions): void;
function scrollTo(arg1: unknown, arg2?: number) {
	if (isObject(arg1)) {
		wrapRef.value!.scrollTo(arg1);
	} else if (isNumber(arg1) && isNumber(arg2)) {
		wrapRef.value!.scrollTo(arg1, arg2);
	}
}

const setScrollTop = (to: number, duration = 500) => {
	if (!isNumber(to)) {
		debugWarn(COMPONENT_NAME, 'value must be a number');
		return;
	}
	nextTick(() => {
		const wrap = unref(wrapRef);
		if (!wrap) {
			return;
		}
		if (props.scrollAnimationOff) {
			wrapRef.value!.scrollTop = to;
		} else {
			const { start } = useScrollTo({
				el: wrap,
				to,
				duration,
			});
			start();
		}
	});
};

// 滚动到底部
function scrollBottom() {
	nextTick(() => {
		const wrap = unref(wrapRef);
		if (!wrap) {
			return;
		}
		const scrollHeight = wrap.scrollHeight as number;
		if (props.scrollAnimationOff) {
			wrapRef.value!.scrollTop = scrollHeight;
		} else {
			const { start } = useScrollTo({
				el: wrap,
				to: scrollHeight,
			});
			start();
		}
	});
}

const setScrollLeft = (value: number) => {
	if (!isNumber(value)) {
		debugWarn(COMPONENT_NAME, 'value must be a number');
		return;
	}
	wrapRef.value!.scrollLeft = value;
};

// 更新滚动条状态
const update = () => {
	if (!wrapRef.value) return;
	const offsetHeight = wrapRef.value.offsetHeight - GAP;
	const offsetWidth = wrapRef.value.offsetWidth - GAP;

	const originalHeight = offsetHeight ** 2 / wrapRef.value.scrollHeight;
	const originalWidth = offsetWidth ** 2 / wrapRef.value.scrollWidth;
	const height = Math.max(originalHeight, props.minSize);
	const width = Math.max(originalWidth, props.minSize);

	ratioY.value =
		originalHeight /
		(offsetHeight - originalHeight) /
		(height / (offsetHeight - height));
	ratioX.value =
		originalWidth /
		(offsetWidth - originalWidth) /
		(width / (offsetWidth - width));

	sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : '';
	sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : '';
};

// 监听属性变化：监听noresize属性的变化，控制是否启用resize监听
watch(
	() => props.noresize,
	(noresize) => {
		if (noresize) {
			stopResizeObserver?.(); // 停止resize监听
			stopResizeListener?.(); // 停止窗口resize事件监听
		} else {
			({ stop: stopResizeObserver } = useResizeObserver(resizeRef, update)); // 启用resize监听
			stopResizeListener = useEventListener('resize', update); // 监听窗口resize事件
		}
	},
	{ immediate: true }
);

// 监听属性变化：监听maxHeight和height属性的变化，更新滚动条状态
watch(
	() => [props.maxHeight, props.height],
	() => {
		if (!props.native)
			nextTick(() => {
				update(); // 更新滚动条状态
				if (wrapRef.value) {
					barRef.value?.handleScroll(wrapRef.value); // 处理滚动事件
				}
			});
	}
);

// 提供上下文给子组件
provide(
	scrollbarContextKey,
	reactive({
		scrollbarElement: scrollbarRef,
		wrapElement: wrapRef,
	})
);

// 组件挂载后，执行初始化操作
onMounted(() => {
	if (!props.native)
		nextTick(() => {
			update();
		});
});

// 组件更新后，再次执行更新操作
onUpdated(() => update());

defineExpose({
	/** @description 滚动条包裹的 ref 对象 */
	wrapRef,
	/** @description 手动更新滚动条状态 */
	update,
	/** @description 滚动到一组特定坐标 */
	scrollTo,
	/** @description 设置滚动条到顶部的距离 */
	setScrollTop,
	/** @description 设置滚动条到左边的距离 */
	setScrollLeft,
	/** @description 触发滚动事件 */
	handleScroll,
	/** @description 滚动到底部 */
	scrollBottom,
});
</script>
