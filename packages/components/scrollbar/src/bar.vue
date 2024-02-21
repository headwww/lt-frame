<template>
	<thumb :move="moveX" :size="width" :ratio="ratioX" :always="always" />
	<thumb
		vertical
		:size="height"
		:move="moveY"
		:ratio="ratioY"
		:always="always"
	/>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Thumb from './thumb.vue';
import { GAP } from './util';
import { barProps } from './bar';

const props = defineProps(barProps);
const moveX = ref(0);
const moveY = ref(0);
const handleScroll = (wrap: HTMLDivElement) => {
	const offsetHeight = wrap.offsetHeight - GAP;
	const offsetWidth = wrap.offsetWidth - GAP;
	moveY.value = ((wrap.scrollTop * 100) / offsetHeight) * props.ratioY;
	moveX.value = ((wrap.scrollLeft * 100) / offsetWidth) * props.ratioX;
};

defineExpose({
	handleScroll,
});
</script>
