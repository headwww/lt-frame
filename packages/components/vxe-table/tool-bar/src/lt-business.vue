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
import { PropType } from 'vue';
import { LtButton } from '../../../button';
import { ToolBusinessOptions } from './tool-business';

defineProps({
	options: {
		type: Array as PropType<ToolBusinessOptions[]>,
		default: () => [],
	},
});

const emit = defineEmits(['itemClick']);

function handClick(item: ToolBusinessOptions) {
	emit('itemClick', item);
}

function handleItem(item: ToolBusinessOptions): any {
	const { disabled, visible } = item;
	const obj = { ...item };
	if (isFunction(disabled)) {
		// 不是全局的不支持函数设置，直接在外部做响应式即可
		obj.disabled = false;
	}
	if (isFunction(visible)) {
		// 不是全局的不支持函数设置，直接在外部做响应式即可
		obj.visible = true;
	}
	return obj;
}
</script>
