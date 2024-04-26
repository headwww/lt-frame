<template>
	<Row :gutter="[16, 16]">
		<Col :span="8">
			<LtTree
				title="右侧操作按钮/自定义图标"
				helpMessage="帮助信息"
				:treeData="treeData"
				:actionList="actionList"
				:renderIcon="createIcon"
			/>
		</Col>
		<Col :span="8">
			<LtTree
				title="右键菜单"
				:treeData="treeData"
				:beforeRightClick="getRightMenuList"
			/>
		</Col>
		<Col :span="8">
			<LtTree
				title="工具栏使用"
				toolbar
				checkable
				search
				:treeData="treeData"
				:beforeRightClick="getRightMenuList"
			/>
		</Col>
		<Col :span="8">
			<LtTree
				title="没有fieldNames，插槽有效"
				helpMessage="正确的示例"
				:treeData="treeData3"
			>
				<template #title="item"> 插槽：{{ item.name }} </template>
			</LtTree>
		</Col>
		<Col :span="8">
			<LtTree
				title="有fieldNames后，插槽失效"
				helpMessage="错误的示例, 应该显示插槽的内容才对"
				:fieldNames="{ key: 'id', title: 'name' }"
				:treeData="treeData2"
			>
				<template #title="item"> 插槽：{{ item.title }} </template>
			</LtTree>
		</Col>
		<Col :span="8">
			<LtTree
				title="有fieldNames后，actionList失效"
				helpMessage="错误的示例，应该在鼠标移上去时，显示新增和删除按钮才对"
				:treeData="treeData3"
				:actionList="actionList"
				:fieldNames="{ key: 'key', title: 'name' }"
			/>
		</Col>
	</Row>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { Row, Col } from 'ant-design-vue';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { EventDataNode } from 'ant-design-vue/es/vc-tree/interface';
import { ContextMenuItem, LtTree, TreeActionItem } from '@lt-frame/components';
import { treeData, treeData2, treeData3 } from './data';

function handlePlus(node: any) {
	console.log(node);
}

function getRightMenuList(node: EventDataNode): Promise<ContextMenuItem[]> {
	const menu = [
		{
			label: '新增',
			handler: () => {
				console.log('点击了新增', node);
			},
			icon: 'bi:plus',
		},
		{
			label: '删除',
			handler: () => {
				console.log('点击了删除', node);
			},
			icon: 'bx:bxs-folder-open',
		},
	];
	return new Promise((resolve) => {
		resolve(menu);
	});
}
const actionList: TreeActionItem[] = [
	{
		// show:()=>boolean;
		render: (node) =>
			h(PlusOutlined, {
				class: 'ml-2',
				onClick: () => {
					handlePlus(node);
				},
			}),
	},
	{
		render: () => h(DeleteOutlined),
	},
];

function createIcon({ level }: any) {
	if (level === 1) {
		return 'ion:git-compare-outline';
	}
	if (level === 2) {
		return 'ion:home';
	}
	if (level === 3) {
		return 'ion:airplane';
	}
	return '';
}
</script>
