<template>
	<SvgIcon
		:size="size"
		:name="getLocalIcon"
		v-if="isLocal"
		:class="[$attrs.class, 'anticon']"
		:color="color"
		:spin="spin"
	/>
	<span
		v-else
		ref="elRef"
		:class="[$attrs.class, `${ns.be()} anticon`, spin && ns.b('spin')]"
		:style="getWrapStyle"
	></span>
</template>

<script lang="ts" setup>
import { isString } from 'lodash-es';
import {
	CSSProperties,
	computed,
	nextTick,
	onMounted,
	ref,
	unref,
	watch,
} from 'vue';
import Iconify from '@iconify/iconify/dist/iconify.js';
import { useNamespace } from '@lt-frame/hooks';
import SvgIcon from '../../svg-icon';
import { iconProps } from './icon';

defineOptions({
	name: 'LTIcon',
});
const props = defineProps(iconProps);
const ns = useNamespace('icon');
const isLocal = computed(() => props.icon.startsWith('svg-icon:'));
const getLocalIcon = computed(() => props.icon.replace('svg-icon:', ''));
const getIconRef = computed(() => `${props.icon}`);

const elRef = ref(null);

const update = async () => {
	if (unref(isLocal)) return;

	const el: any = unref(elRef);
	if (!el) return;

	await nextTick();
	const icon = unref(getIconRef);
	if (!icon) return;

	const svg = Iconify.renderSVG(icon, {});
	if (svg) {
		el.textContent = '';
		el.appendChild(svg);
	} else {
		const span = document.createElement('span');
		span.className = 'iconify';
		span.dataset.icon = icon;
		el.textContent = '';
		el.appendChild(span);
	}
};

const getWrapStyle = computed((): CSSProperties => {
	const { size, color } = props;
	let fs = size;
	if (isString(size)) {
		fs = parseInt(size, 10);
	}

	return {
		fontSize: `${fs}px`,
		color,
		display: 'inline-flex',
	};
});

watch(() => props.icon, update, { flush: 'post' });

onMounted(update);
</script>
