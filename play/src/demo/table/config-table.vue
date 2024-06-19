<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme">
			<LtPane size="18" min-size="18" max-size="36" class="p12">
				<template #default="{ height }">
					<LtDivider title="公司" />
					<LtTree
						search
						directoryTree
						:loading="treeLoading"
						:treeData="treeData"
						:height="height - 120"
						:style="{
							height: `${height - 120}px`,
						}"
						v-model:selectedKeys="selectedKeys"
					>
						<template #title="data">
							<div class="h40 lh-40">
								<Tooltip :title="data.title">
									{{ data.title }}
								</Tooltip>
							</div>
						</template>
					</LtTree>
					<LtButton @click="findCorps" class="w-full mt-35">刷新</LtButton>
				</template>
			</LtPane>
			<LtPane size="82" class="p12">
				<LtDivider title="职员信息" />
				<LtConfigTable
					entity="lt.fw.core.model.biz.Employee"
					v-model:config="gridOptions"
					v-model:pager="pager"
				>
					<template #table>
						<vxe-grid
							class="lt-table-scrollbar"
							ref="xGrid"
							v-bind="gridOptions"
						></vxe-grid>
					</template>
				</LtConfigTable>
			</LtPane>
		</LtSplitpanes>
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	LtPageLayout,
	LtSplitpanes,
	LtPane,
	LtDivider,
	LtTree,
	LtButton,
	TreeItem,
} from '@lt-frame/components';
import { Condition } from '@lt-frame/utils';
import { LtConfigTable, LtHttp, PageResponse } from '@lt-frame/version-1';
import { Tooltip } from 'ant-design-vue';
import { onMounted, ref, watch } from 'vue';
import { VxeGridInstance, VxeGridProps, VxePagerProps } from 'vxe-table';

const treeLoading = ref(false);

const treeData = ref<TreeItem[]>([]);

const selectedKeys = ref<string[]>([]);

const xGrid = ref<VxeGridInstance>();

const gridOptions = ref<VxeGridProps>({});

onMounted(() => {
	findCorps();
});

function findCorps() {
	treeLoading.value = true;
	treeData.value = [];
	selectedKeys.value = [];
	find1<any>(new Condition())
		.then((resp) => {
			// 将请求到的数据处理成tree组件需要的方式
			treeData.value = resp.map(
				(item) =>
					({
						title: item.name,
						key: item.id,
						icon: 'octicon:organization-16',
						row: item,
					}) as TreeItem
			);
		})
		.finally(() => {
			treeLoading.value = false;
		});
}

function find1<T>(condition: Condition) {
	condition.setTargetClass('lt.fw.core.model.biz.Corp');
	return LtHttp.post<Array<T>>({
		url: 'api/corpServiceImpl/findCorps',
		data: [condition],
	});
}

watch(
	() => selectedKeys.value,
	() => {
		const treeItem = treeData.value.find(
			(item) => selectedKeys.value[0] === item.key
		);
		finEmployee(treeItem);
	},
	{
		immediate: true,
	}
);

function finEmployee(treeItem?: TreeItem) {
	// 清空table的数据
	gridOptions.value.data = [];
	if (treeItem) {
		const condition = new Condition();
		condition.prop('corp.id', treeItem.row.id);
		condition.addQueryPath('dept.name');
		condition.addQueryPath('corp.name');
		gridOptions.value.loading = true;
		find2<any>(condition)
			.then((resp) => {
				gridOptions.value.data = resp;
			})
			.finally(() => {
				gridOptions.value.loading = false;
			});
	}
}

/**
 * 查询职员
 * zjj
 * @param condition
 * @returns
 */
function find2<T>(condition: Condition) {
	condition.setTargetClass('lt.fw.core.model.biz.Employee');
	return LtHttp.post<Array<T>>({
		url: 'api/employeeServiceImpl/findEmployees',
		data: [condition],
	});
}

const condition = new Condition();

const pager = ref<VxePagerProps>({});
condition.setTargetClass('lt.app.common.model.Area');
LtHttp.post<PageResponse<any>>({
	url: 'api/areaService/findAreasByPage',
	data: [
		{
			pageNo: 0,
			pageSize: 2,
			rowCountEnabled: true,
		},
		condition,
	],
}).then((data) => {
	pager.value.total = data.rowCount;
	pager.value.pageSize = 4;
});
</script>
