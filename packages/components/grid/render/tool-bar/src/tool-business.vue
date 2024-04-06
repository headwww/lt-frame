<template>
	<LtButton
		style="margin-right: 10px"
		v-for="item in options"
		v-bind="handleItem(item)"
		:key="item.event"
		@click="handClick(item)"
		>{{ item.text }}</LtButton
	>
</template>

<script lang="ts" setup>
import { isFunction } from 'lodash-es';
import { LtButton } from '../../../../button';
import { toolBusinessProps, ToolBusinessOptions } from './tool-business';

const props = defineProps(toolBusinessProps);

const emit = defineEmits(['itemClick']);

function handClick(item: ToolBusinessOptions) {
	emit('itemClick', item, props.params);
}

function handleItem(item: ToolBusinessOptions): any {
	const { disabled } = item;
	const obj = { ...item };
	if (isFunction(disabled)) {
		obj.disabled = disabled(props.params!!);
	}
	return obj;
}
</script>
