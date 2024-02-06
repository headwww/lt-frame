<template>
	<span :class="getClass">
		<Icon v-bind="getIconAttrs" />
	</span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import Icon from '../../icon';
import { arrowProps } from './arrow';

defineOptions({
	name: 'LTArrow',
});

const props = defineProps(arrowProps);

const getIconAttrs = computed(() => ({
	color: props.color,
	size: props.size,
	spin: props.spin,
	icon: props.icon ? props.icon : 'ion:chevron-forward',
}));

const ns = useNamespace('arrow');

const getClass = computed(() => {
	const { expand, up, down, inset } = props;
	return [
		ns.b(),
		{
			'lt-arrow__active': expand,
			up,
			inset,
			down,
		},
	];
});
</script>
