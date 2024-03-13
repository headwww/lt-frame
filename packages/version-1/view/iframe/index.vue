<template>
	<div :class="ns.b()" :style="getWrapStyle">
		<Spin :spinning="loading" size="large" :style="getWrapStyle">
			<iframe
				:src="frameSrc"
				:class="ns.e('main')"
				ref="frameRef"
				@load="hideLoading"
			></iframe>
		</Spin>
	</div>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { ref, unref, computed } from 'vue';
import { Spin } from 'ant-design-vue';
import { useNamespace, useWindowSizeFn } from '@lt-frame/hooks';

const ns = useNamespace('iframe');

defineProps({
	frameSrc: { type: String, default: '' },
});

const loading = ref(true);
const heightRef = ref(window.innerHeight);
const frameRef = ref<HTMLFrameElement>();

useWindowSizeFn(calcHeight, { wait: 150, immediate: true });

function calcHeight() {
	const iframe = unref(frameRef);
	if (!iframe) {
		return;
	}
	heightRef.value = window.innerHeight;
	const { clientHeight } = document.documentElement;
	iframe.style.height = `${clientHeight}px`;
}

const getWrapStyle = computed(
	(): CSSProperties => ({
		height: `${unref(heightRef)}px`,
	})
);

function hideLoading() {
	loading.value = false;
}
</script>
