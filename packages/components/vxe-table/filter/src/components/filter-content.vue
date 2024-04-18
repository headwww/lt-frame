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
			v-model:checkedKeys="filterData.checkedKeys"
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
import { ContentFilterData } from '../advanced-filter';

const props = defineProps({
	filterData: {
		type: Object as PropType<ContentFilterData>,
		default: () => ({
			checkedKeys: ['$_SELECT_ALL'],
		}),
	},
	treeData: {
		type: Object as PropType<TreeProps['treeData']>,
		default: () => {},
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

const filterData = reactive<ContentFilterData>({
	checkedKeys: props.filterData.checkedKeys,
});

function getFilterData() {
	return filterData as ContentFilterData;
}

defineExpose({ getFilterData });
</script>
