<template>
	<span :class="getClass">
		<slot></slot>
		<BasicHelp :class="ns.b('help')" v-if="helpMessage" :text="helpMessage" />
	</span>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import { useSlots, computed } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import BasicHelp from './help.vue';

const props = defineProps({
	/**
	 * Help text list or string
	 * @default: ''
	 */
	helpMessage: {
		type: [String, Array] as PropType<string | string[]>,
		default: '',
	},
	/**
	 * Whether the color block on the left side of the title
	 * @default: false
	 */
	span: { type: Boolean },
	/**
	 * Whether to default the text, that is, not bold
	 * @default: false
	 */
	normal: { type: Boolean },
});

const ns = useNamespace('title');
const slots = useSlots();
const getClass = computed(() => [
	ns.b(),
	{ [ns.b('show-span')]: props.span && slots.default },
	{ [ns.b('normal')]: props.normal },
]);
</script>
