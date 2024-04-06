<template>
	<div :class="ns.b()">
		<div :class="ns.e('title')">
			<span v-if="strip" :style="getStrip"></span>
			<span :class="ns.e('text')">{{ title }} </span>
			<Help v-if="helpProps" v-bind="helpProps"></Help>
		</div>
		<div>
			<slot name="extra"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { CSSProperties, computed } from 'vue';
import { dividerProps } from './divider';
import Help from './help.vue';

const props = defineProps(dividerProps);

const ns = useNamespace('divider');

const getStrip = computed(
	(): CSSProperties => ({
		width: '2px',
		height: '16px',
		lineHeight: '24px',
		backgroundColor: '#3370ff',
		borderRadius: '1px',
		marginRight: '8px',
		...props.stripStyle,
	})
);
</script>
