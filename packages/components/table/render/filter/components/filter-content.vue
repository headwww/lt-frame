<template>
	<div
		style="
			margin: 0 10px;
			height: 240px;
			border: 1px solid #ececec;
			border-radius: 6px;
		"
	>
		<a-tree
			v-bind:="attrs?.contentAttrs"
			v-model:checkedKeys="config.checkedKeys"
			checkable
			:selectable="false"
			:height="233"
			default-expand-all
			:tree-data="treeData"
		>
		</a-tree>
	</div>
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import { type TreeProps, Tree as ATree } from 'ant-design-vue';
import { ContentFilterConfig, DeepFilterAttrs } from '../types';

const props = defineProps({
	attrs: {
		type: Object as PropType<DeepFilterAttrs>,
	},
	treeData: Object as PropType<TreeProps['treeData']>,
	checkedKeys: {
		type: Array<string>,
		default: ['$_SELECT_ALL'],
	},
});
/** 可选的项，默认全选，内置全选和空白两项 */
const treeData: TreeProps['treeData'] = [
	{
		title: '(全选)',
		key: '$_SELECT_ALL',
		children: [
			{
				title: '(空白)',
				key: '$_SELECT_NULL',
			},
			...props.treeData!!,
		],
	},
];

const config = reactive<ContentFilterConfig>({
	treeData: props.treeData,
	checkedKeys: props.checkedKeys,
});

function getConfig() {
	return config as ContentFilterConfig;
}

defineExpose({ getConfig });
</script>
