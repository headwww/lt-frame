<template>
	<LtScrollbar scroll-animation-off ref="wrapperRef">
		<div
			:style="getContentStyle"
			ref="contentRef"
			v-loading="loading"
			:loading-tip="loadingTip"
		>
			<slot></slot>
		</div>
	</LtScrollbar>
</template>

<script lang="ts" setup>
import {
	CSSProperties,
	computed,
	nextTick,
	ref,
	unref,
	watch,
	watchEffect,
} from 'vue';
import { useMutationObserver } from '@vueuse/core';
import { useWindowSizeFn } from '@lt-frame/hooks';
import { Loading as vLoading } from '../../../loading';
import LtScrollbar from '../../../scrollbar';
import { modalWrapperProps } from './modal-wrapper';

const props = defineProps(modalWrapperProps);

const emit = defineEmits(['height-change']);
const wrapperRef = ref(null);
const contentRef = ref(null);

const realHeightRef = ref(0);
const minRealHeightRef = ref(0);

useMutationObserver(
	contentRef,
	() => {
		setContentHeight();
	},
	{
		attributes: true,
		subtree: true,
	}
);

// 当屏幕尺寸发生变化时
useWindowSizeFn(
	() => {
		setContentHeight();
	},
	{ wait: 0, immediate: true }
);

// 设置 ModalWrapper 组件的高度，以确保适应不同的布局需求。
// 如果是全屏模式，可能会记住之前的高度，以便在退出全屏后还原高度。
watch(
	() => props.fullScreen,
	(v) => {
		setContentHeight();
		if (!v) {
			// 非全屏
			realHeightRef.value = minRealHeightRef.value;
		} else {
			// 全屏
			minRealHeightRef.value = realHeightRef.value;
		}
	}
);

const getContentStyle = computed(
	(): CSSProperties => ({
		minHeight: `${props.minHeight}px`,
		[props.fullScreen ? 'height' : 'maxHeight']: `${unref(realHeightRef)}px`,
	})
);

async function scrollTop() {
	nextTick(() => {
		const wrapperRefDom = unref(wrapperRef);
		if (!wrapperRefDom) return;
		(wrapperRefDom as any)?.setScrollTop(0);
	});
}

watchEffect(() => {
	setContentHeight();
});

async function setContentHeight() {
	// 解决在弹窗关闭的时候监听还存在,导致再次打开弹窗没有高度
	// 加上这个,就必须在使用的时候传递父级的open
	if (!props.open) return;
	const wrapperRefDom = unref(wrapperRef);
	if (!wrapperRefDom) return;
	const antModalBody = (wrapperRefDom as any).$el.parentElement;
	if (!antModalBody) return;
	antModalBody.style.padding = '0';
	await nextTick();

	try {
		const antModal =
			antModalBody.parentElement && antModalBody.parentElement.parentElement;
		if (!antModal) return;
		const modalRect = getComputedStyle(antModal as Element).top;
		const modalTop = Number.parseInt(modalRect, 10);
		// 非全屏modal的最大height是
		let maxHeight =
			window.innerHeight -
			modalTop * 2 +
			(props.footerOffset! || 0) -
			props.modalFooterHeight -
			props.modalHeaderHeight -
			(props.isSubTitle ? 0 : 50);

		// 距离顶部过进会出现滚动条
		if (modalTop < 40) {
			maxHeight -= 26;
		}
		await nextTick();
		const contentElement: any = unref(contentRef);
		if (!contentElement) return;

		await nextTick();
		if (props.fullScreen) {
			realHeightRef.value =
				window.innerHeight -
				props.modalFooterHeight -
				props.modalHeaderHeight -
				(props.isSubTitle ? 0 : 50);
		} else {
			// eslint-disable-next-line no-nested-ternary
			realHeightRef.value = props.height
				? props.height
				: contentElement.scrollHeight > maxHeight
					? maxHeight
					: contentElement.scrollHeight;
		}
		emit('height-change', unref(realHeightRef));
	} catch (error) {
		//
	}
}

defineExpose({
	scrollTop,
	setContentHeight,
});
</script>
