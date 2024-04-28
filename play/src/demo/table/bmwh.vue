<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme">
			<LtPane size="18" min-size="18" max-size="36" style="padding: 12px">
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
							<div style="height: 40px; line-height: 40px">
								<Tooltip :title="data.title">
									{{ data.title }}
								</Tooltip>
							</div>
						</template>
					</LtTree>
					<LtButton @click="findCorps" style="width: 100%; margin-top: 35px"
						>刷新</LtButton
					>
				</template>
			</LtPane>
			<LtPane size="82" style="padding: 12px">
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
				<vxe-grid ref="xGrid" v-bind="gridOptions"></vxe-grid>
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
import { isArray } from 'lodash-es';
import { onMounted, reactive, ref, watch } from 'vue';
import {
	VxeGlobalRendererHandles,
	VxeGridInstance,
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

const gridOptions = reactive<VxeGridProps>({
	autoResize: true,
	height: 'auto',
	editConfig: {
		trigger: 'click',
		mode: 'row',
	},
	align: 'center',
	loading: false,
	data: [],
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
	condition.prop('parent.id', item?.row.id);
	LtHttp.post({
		url: 'api/deptServiceImpl/findDepts',
		data: [condition],
	})
		.then((resp) => {
			gridOptions.data = resp;
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
