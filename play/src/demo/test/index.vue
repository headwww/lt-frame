<template>
	<div>
		<RenderEngine :schema="schema"></RenderEngine>
		<div class="p-20px">
			<NestedComponent v-model="list" class="w-full p-12px"></NestedComponent>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import NestedComponent from './NestedComponent.vue';
import RenderEngine from './RenderEngine.vue';

const schema = {
	componentName: 'Page',
	state: {
		text: {
			type: 'JSExpression',
			value: '测试',
		},
	},
	children: [
		{
			componentName: 'Input',
			props: {
				value: {
					type: 'JSExpression',
					value: 'state.text',
				},
			},
		},
		{
			componentName: 'Button',
		},
	],
};

const list = ref([
	{
		name: 'item 1',
		children: [],
	},
	{
		name: 'item 2',
		children: [],
	},
	{
		name: 'item 3',
		children: [],
	},
	{
		name: 'item 4',
		children: [],
	},
	{
		name: 'item 5',
		children: [],
	},
]);
</script>
