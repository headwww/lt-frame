<template>
	<div
		ref="paneRef"
		class="splitpanes__pane"
		@click="onPaneClick($event, instance?.uid)"
		:style="style"
	>
		<slot :width="rect.width" :height="rect.height"></slot>
	</div>
</template>

<script lang="ts" setup>
import {
	CSSProperties,
	computed,
	getCurrentInstance,
	inject,
	onBeforeUnmount,
	onMounted,
	reactive,
	ref,
	watch,
} from 'vue';
import { isString } from 'lodash-es';
// import { useElementSize } from '@vueuse/core';
import { useResizeObserver } from '@vueuse/core';
import { splitpanesKey, SplitpanesMethods } from './splitpanes';
import { paneProps } from './pane';

defineOptions({
	name: 'LtPane',
});
const props = defineProps(paneProps);

const { onPaneAdd, onPaneRemove, onPaneClick, requestUpdate } = inject(
	splitpanesKey
) as SplitpanesMethods;

const paneRef = ref<HTMLDivElement>();

const style = ref<CSSProperties>();

const rect = reactive<{
	width: number;
	height: number;
}>({
	width: 0,
	height: 0,
});

useResizeObserver(paneRef, (entries) => {
	const entry = entries[0];
	const { width, height } = entry.contentRect;
	rect.width = width;
	rect.height = height;
});
// const { width, height } = useElementSize(paneRef);

// console.log(width, height);

onMounted(() => {
	onPaneAdd(getPane.value);
});

onBeforeUnmount(() => {
	onPaneRemove(getPane.value);
});

const instance = getCurrentInstance();

const getPane = computed(() => ({
	uid: instance?.uid,
	el: paneRef.value,
	minSize: props.minSize,
	maxSize: props.maxSize,
	size: props.size,
	update,
}));

function update(css: CSSProperties) {
	style.value = css;
}

const sizeNumber = computed(() =>
	props.size || props.size === 0
		? isString(props.size)
			? parseFloat(props.size)
			: props.size
		: null
);

const minSizeNumber = computed(() =>
	isString(props.minSize) ? parseFloat(props.minSize) : props.minSize
);

const maxSizeNumber = computed(() =>
	isString(props.maxSize) ? parseFloat(props.maxSize) : props.maxSize
);

watch(
	() => sizeNumber.value,
	(v) => {
		v && requestUpdate({ target: getPane.value, size: v });
	}
);

watch(
	() => minSizeNumber.value,
	(v) => {
		requestUpdate({ target: getPane.value, min: v });
	}
);

watch(
	() => maxSizeNumber.value,
	(v) => {
		requestUpdate({ target: getPane.value, max: v });
	}
);
</script>
