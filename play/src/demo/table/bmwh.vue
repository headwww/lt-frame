<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme">
			<LtPane size="18" min-size="18" max-size="36" style="padding: 12px">
				<LtTree
					:loading="treeLoading"
					search
					:treeData="treeData"
					directoryTree
					v-model:selectedKeys="selectedKeys"
					style="height: 700px"
				>
					<template #title="data">
						<div
							style="height: 40px; line-height: 40px"
							@click="finDepts(data)"
						>
							<span>{{ data.title }}</span>
						</div>
					</template>
				</LtTree>
			</LtPane>
			<LtPane size="82" style="padding: 12px">
				<LtDivider title="部门信息"></LtDivider>
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
} from '@lt-frame/components';
import { Condition } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import { isArray } from 'lodash-es';
import { onMounted, reactive, ref, watch } from 'vue';
import {
	VxeGlobalRendererHandles,
	VxeGridInstance,
	VxeGridProps,
} from 'vxe-table';

const treeData = ref<TreeItem[]>([]);

const treeLoading = ref(false);

const xGrid = ref<VxeGridInstance>();

const selectedKeys = ref<string[]>([]);

watch(
	() => selectedKeys.value,
	() => {
		console.log(selectedKeys.value);
	}
);

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

	toolbarConfig: {
		buttons: [
			{
				buttonRender: {
					name: '$lt-tool-function',
					props: {
						options: [
							{
								default: 'insert',
								text: '新增',
								type: 'primary',
								divider: false,
								// disabled: true,
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
						],
					},
					events: {
						onSave: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							console.log(param);
						},
						onRefresh: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							param.$grid?.commitProxy('query');
						},
						onRemove: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							console.log(param);
						},
					},
				},
			},
		],
	},
});

const findCorps = () => {
	const condition = new Condition();
	condition.setTargetClass('lt.fw.core.model.biz.Corp');
	return LtHttp.post({
		url: 'api/corpServiceImpl/findCorps',
		data: [condition],
	});
};

const finDepts = (item: TreeItem) => {
	gridOptions.loading = true;
	const condition = new Condition();
	condition.setTargetClass('lt.fw.core.model.biz.Dept');
	condition.prop('parent.id', item.row.id);
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
	treeLoading.value = true;
	findCorps()
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
});
</script>
