<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme">
			<LtPane size="18" min-size="18" max-size="36" class="p12">
				<template #default="{ height }">
					<LtTree
						:loading="treeLoading"
						search
						:treeData="treeData"
						directoryTree
						v-model:selectedKeys="selectedKeys"
						:height="height - 80"
						:style="{
							height: `${height - 80}px`,
						}"
						:beforeRightClick="getRightMenuList"
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
				<LtDivider title="部门信息"></LtDivider>
				<vxe-toolbar ref="toolbarRef">
					<template #buttons>
						<LtFunction
							:instance="xGrid"
							:options="options"
							@refresh="selectedKeys = [selectedKeys[0]]"
						></LtFunction>
					</template>
				</vxe-toolbar>
				<vxe-grid v-on="gridEvents" ref="xGrid" v-bind="gridOptions"></vxe-grid>
			</LtPane>
		</LtSplitpanes>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import {
	LtPageLayout,
	LtSplitpanes,
	LtPane,
	LtTree,
	TreeItem,
	LtDivider,
	LtFunction,
	ToolButtonOptions,
	LtButton,
	ContextMenuItem,
} from '@lt-frame/components';
import { Condition } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import { Tooltip } from 'ant-design-vue';
import { EventDataNode } from 'ant-design-vue/es/tree';
import { get, isArray, uniqueId } from 'lodash-es';
import { onMounted, reactive, ref, watch } from 'vue';
import {
	VxeGlobalRendererHandles,
	VxeGridInstance,
	VxeGridListeners,
	VxeGridProps,
	VxeToolbarInstance,
} from 'vxe-table';

const treeData = ref<TreeItem[]>([]);

const treeLoading = ref(false);

const xGrid = ref<VxeGridInstance>();

const toolbarRef = ref<VxeToolbarInstance>();

const selectedKeys = ref<string[]>([]);

watch(
	() => selectedKeys.value,
	() => {
		const treeItem = treeData.value.find(
			(item) => selectedKeys.value[0] === item.key
		);
		finDepts(treeItem);
	}
);

function getRightMenuList(node: EventDataNode): Promise<ContextMenuItem[]> {
	const menu = [
		{
			label: '详情',
			handler: () => {
				console.log('点击了详情', node);
			},
			icon: 'mdi:form-outline',
		},
	];
	return new Promise((resolve) => {
		resolve(menu);
	});
}

const options = reactive<ToolButtonOptions[]>([
	{
		default: 'insert',
		text: '新增',
		type: 'primary',
		divider: false,
		disabled: true,
		preIcon: 'svg-icon:frame-insert',
	},
	{
		default: 'save',
		text: '保存',
		type: 'text',
		preIcon: 'svg-icon:frame-save',
	},
	{
		default: 'refresh',
		text: '刷新',
		type: 'text',
		disabled: true,
		preIcon: 'svg-icon:frame-refresh',
	},
	{
		default: 'reset',
		text: '清除筛选',
		type: 'text',
		preIcon: 'svg-icon:frame-clean',
	},
	{
		default: 'remove',
		text: '删除',
		type: 'text',
		preIcon: 'svg-icon:frame-delete',
	},
]);

const gridEvents = reactive<VxeGridListeners>({
	async menuClick({ menu, row }) {
		const $grid = xGrid.value;
		if ($grid) {
			switch (menu.code) {
				case 'insertChild':
					const { row: newRow } = await $grid.insert({
						corp: row,
						$id: uniqueId('$'),
						$parentId: row.$id,
					});
					await $grid.setTreeExpand(row, true); // 将父节点展开
					await $grid.setEditRow(newRow); // 插入子节点
					break;
			}
		}
	},
});

const gridOptions = reactive<VxeGridProps>({
	autoResize: true,
	height: 'auto',

	editConfig: {
		trigger: 'dblclick',
		mode: 'row',
	},
	treeConfig: {
		transform: true,
		rowField: '$id',
		parentField: '$parentId',
		hasChild: 'hasChild',
	},
	checkboxConfig: {
		range: false,
		isShiftKey: false,
		checkStrictly: true,
	},
	align: 'center',
	loading: false,
	data: [],
	stripe: true,

	columns: [
		{ type: 'checkbox', width: 40 },
		{ type: 'seq', width: 40, title: '#' },
		{
			width: 100,
			fixed: 'right',
			title: '操作',
			cellRender: {
				name: '$lt-cell-operate',
				props: {
					editVisible: true,
					editDisabled: (
						params: VxeGlobalRendererHandles.RenderDefaultParams
					) => params.row.type === 'HEAD',
				},
			},
		},
		{
			treeNode: true,
			field: 'code',
			title: '编码',
			width: '300',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},

		{
			field: 'name',
			title: '名称',
			width: '300',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},
	],
	editRules: {
		code: [{ required: true, content: '必填字段' }],
		name: [{ required: true, content: '必填字段' }],
	},
	menuConfig: {
		body: {
			options: [[{ code: 'insertChild', name: '新增子级' }]],
		},
	},
});

const findCorps = () => {
	treeLoading.value = true;
	const condition = new Condition();
	condition.setTargetClass('lt.fw.core.model.biz.Corp');
	LtHttp.post({
		url: 'api/corpServiceImpl/findCorps',
		data: [condition],
	})
		.then((data) => {
			if (isArray(data)) {
				treeData.value = data.map(
					(item) =>
						({
							title: item.name,
							key: item.id,
							icon: 'octicon:organization-16',
							row: item,
						}) as TreeItem
				);
			}
		})
		.finally(() => {
			treeLoading.value = false;
		});
};

const finDepts = (item?: TreeItem) => {
	options[0].disabled = false;
	options[2].disabled = false;
	gridOptions.loading = true;
	const condition = new Condition();
	condition.setTargetClass('lt.fw.core.model.biz.Dept');
	condition.prop('corp.id', item?.row.id);
	LtHttp.post({
		url: 'api/deptServiceImpl/findDepts',
		data: [condition],
	})
		.then((resp) => {
			gridOptions.data = resp.map((item: any) => ({
				...item,
				$parentId: get(item, 'corp.id'),
				$id: get(item, 'id'),
			}));
		})
		.catch(() => {})
		.finally(() => {
			gridOptions.loading = false;
		});
};

onMounted(async () => {
	findCorps();
});
</script>
