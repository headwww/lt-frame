<template>
	<Row :gutter="[16, 16]">
		<Col :span="8">
			<LtTree
				title="基础示例，默认展开第一层"
				:treeData="treeData"
				defaultExpandLevel="1"
			>
				<template #icon
					><SmileTwoTone style="font-size: 16px; margin-right: 7px"
				/></template>
				<template #title>666</template>
				<template #switcherIcon> <CarryOutOutlined /></template>
			</LtTree>
		</Col>
		<Col :span="8">
			<LtTree
				title="可勾选，默认全部展开"
				:treeData="treeData"
				:checkable="true"
				defaultExpandAll
				@check="handleCheck"
			/>
		</Col>
		<Col :span="8">
			<LtTree
				title="指定默认展开/勾选示例"
				:treeData="treeData"
				:checkable="true"
				:expandedKeys="['0-0']"
				:checkedKeys="['0-0']"
			/>
		</Col>
		<Col :span="8">
			<LtTree
				title="懒加载异步树"
				ref="asyncTreeRef"
				:treeData="tree"
				:load-data="onLoadData"
			/>
		</Col>
		<Col :span="8">
			<Card title="异步数据，默认展开">
				<template #extra>
					<Button @click="loadTreeData" :loading="treeLoading">加载数据</Button>
				</template>
				<Spin :spinning="treeLoading">
					<LtTree ref="asyncExpandTreeRef" :treeData="tree2" />
				</Spin>
			</Card>
		</Col>
		<Col :span="8">
			<Card title="LtTree内置加载">
				<template #extra>
					<Button @click="loadTreeData2" :loading="treeLoading"
						>请求数据</Button
					>
				</template>
				<LtTree ref="loadTreeRef" :treeData="tree2" :loading="treeLoading" />
			</Card>
		</Col>
	</Row>
</template>

<script lang="ts" setup>
import { LtTree, TreeActionType, TreeItem } from '@lt-frame/components';
import { Nullable } from '@lt-frame/utils';
import { Card, Row, Col, Spin, Button } from 'ant-design-vue';
import { cloneDeep, isArray, uniq } from 'lodash-es';
import { nextTick, ref, unref } from 'vue';
import { SmileTwoTone, CarryOutOutlined } from '@ant-design/icons-vue';
import { treeData } from './data';

const asyncTreeRef = ref<Nullable<TreeActionType>>(null);
const asyncExpandTreeRef = ref<Nullable<TreeActionType>>(null);
const loadTreeRef = ref<Nullable<TreeActionType>>(null);
const tree2 = ref<TreeItem[]>([]);
const treeLoading = ref(false);

function handleCheck(checkedKeys: any, e: any) {
	console.log('onChecked', checkedKeys, e);
}

function loadTreeData() {
	treeLoading.value = true;
	// 以下是模拟异步获取数据
	setTimeout(() => {
		// 设置数据源
		tree2.value = cloneDeep(treeData);
		treeLoading.value = false;
		// 展开全部
		nextTick(() => {
			console.log(unref(asyncExpandTreeRef));
			unref(asyncExpandTreeRef)?.expandAll(true);
		});
	}, 2000);
}
function loadTreeData2() {
	treeLoading.value = true;
	// 以下是模拟异步获取数据
	setTimeout(() => {
		// 设置数据源
		tree2.value = cloneDeep(treeData);
		treeLoading.value = false;
	}, 2000);
}

const tree = ref([
	{
		title: 'parent ',
		key: '0-0',
	},
]);

function onLoadData(treeNode: any) {
	return new Promise((resolve: (value?: unknown) => void) => {
		if (isArray(treeNode.children) && treeNode.children.length > 0) {
			resolve();
			return;
		}
		setTimeout(() => {
			const asyncTreeAction: TreeActionType | null = unref(asyncTreeRef);
			if (asyncTreeAction) {
				const nodeChildren = [
					{
						title: `Child Node ${treeNode.eventKey}-0`,
						key: `${treeNode.eventKey}-0`,
					},
					{
						title: `Child Node ${treeNode.eventKey}-1`,
						key: `${treeNode.eventKey}-1`,
					},
				];
				asyncTreeAction.updateNodeByKey(treeNode.eventKey, {
					children: nodeChildren,
				});
				asyncTreeAction.setExpandedKeys(
					uniq([treeNode.eventKey, ...asyncTreeAction.getExpandedKeys()])
				);
			}

			resolve();
		}, 300);
	});
}
</script>
