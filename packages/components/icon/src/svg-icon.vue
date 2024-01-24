<template>
	<svg
		:class="['el-svg-icon', $attrs.class, spin && 'svg-icon-spin']"
		aria-hidden="true"
		:style="getStyle"
	>
		<use :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { svgIconProps } from './svg-icon';

const props = defineProps(svgIconProps);

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
<style lang="less" scoped>
.el-svg-icon {
	--color: inherit;

	position: relative;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 1em;
	height: 1em;
	font-size: inherit;
	line-height: 1em;
	color: var(--color);
	/* stylelint-disable-next-line value-keyword-case */
	fill: currentColor;

	svg {
		width: 1em;
		height: 1em;
	}
}

.svg-icon-spin {
	animation: circle 1.5s infinite linear;
}

/* 旋转动画 */
@keyframes circle {
	0% {
		transform: rotate(0);
	}

	100% {
		transform: rotate(360deg);
	}
}
</style>
