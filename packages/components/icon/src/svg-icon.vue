<template>
	<svg
		:class="[ns.b(), $attrs.class, spin && ns.b('spin')]"
		aria-hidden="true"
		:style="getStyle"
	>
		<use :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import { svgIconProps } from './svg-icon';

const props = defineProps(svgIconProps);

const ns = useNamespace('svg-icon');

const symbolId = computed(() => `#${props.prefix}-${props.name}`);

const getStyle = computed((): CSSProperties => {
	const { size } = props;
	let s = `${size}`;
	s = `${s.replace('px', '')}px`;
	return {
		width: s,
		height: s,
	};
});
</script>
