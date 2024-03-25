<template>
	<LTButton
		style="margin-right: 10px"
		v-for="item in options"
		v-bind="item"
		:key="item.code"
		@click="handClick(item)"
		>{{ item.text }}</LTButton
	>
</template>

<script lang="ts" setup>
import { LTButton } from '../../../../button';
import { toolBusinessProps, ToolBusinessOptions } from './tool-business';

const props = defineProps(toolBusinessProps);

const emit = defineEmits(['itemClick']);

function handClick(item: ToolBusinessOptions) {
	emit('itemClick', item, props.params);
}
</script>
