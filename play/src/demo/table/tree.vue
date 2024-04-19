<template>
	<LtPageLayout title="">
		<vxe-grid
			ref="xGrid"
			class="lt-table-scrollbar"
			v-bind="gridOptions"
			v-on="gridEvents"
		></vxe-grid>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout } from '@lt-frame/components';
import { useMessage } from '@lt-frame/hooks';
import { Condition } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import { concat, get, omit } from 'lodash-es';
import { reactive, ref } from 'vue';
import {
	VxeGridInstance,
	VxeGridProps,
	VxeGridListeners,
	VxeColumnPropTypes,
	VxeGlobalRendererHandles,
} from 'vxe-table';

enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}
const { createMessage } = useMessage();

const xGrid = ref<VxeGridInstance>();

const gridEvents = reactive<VxeGridListeners>({
	async menuClick({ menu, row }) {
		const $grid = xGrid.value;
		if ($grid) {
			switch (menu.code) {
				case 'insertChild':
					const { row: newRow } = await $grid.insert({
						parent: { ...omit(row, 'children', '_X_ROW_CHILD', '_X_ROW_KEY') },
						parentId: row.id,
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
	editConfig: {},
	height: 'auto',
	stripe: false,
	checkboxConfig: {
		range: false,
		isShiftKey: false,
		checkStrictly: true,
	},
	treeConfig: {
		transform: true,
		rowField: 'id',
		parentField: 'parentId',
		hasChild: 'hasChild',
	},
	columns: [
		{ type: 'seq', width: 30 },
		{ type: 'checkbox', width: 50 },
		{
			width: 100,
			fixed: 'right',
			align: 'center',
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
			width: 200,
			field: 'code',
			title: '编码',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},

		{
			width: 250,
			field: 'name',
			title: '名称',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},
		{
			field: 'type',
			title: '类型',
			formatter: formatEnum(CorpType),
			editRender: {
				name: '$lt-edit-select',
				props: {
					options: [
						{
							label: '公司',
							value: 'SUBSIDIARY',
						},
						{
							label: '集团',
							value: 'HEAD',
							disabled: true,
						},
						{
							label: '工厂',
							value: 'FACTORY',
						},
					],
				},
			},
		},
	],
	menuConfig: {
		body: {
			options: [[{ code: 'insertChild', name: '新增子级' }]],
		},
	},
	proxyConfig: {
		ajax: {
			query: () => findCorps(),
		},
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
							const { $grid } = param;
							if ($grid) {
								const insertRecords = $grid.getInsertRecords();
								const updateRecords = $grid.getUpdateRecords();
								const mergedArray = concat(insertRecords, updateRecords);
								if (mergedArray.length > 0) {
									saveCorps(mergedArray);
								}
							}
						},
						onRefresh: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							param.$grid?.commitProxy('query');
						},
						onRemove: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							const checkboxRecords = param.$grid?.getCheckboxRecords();
							const b = checkboxRecords?.some((item) => item.type === 'HEAD');

							if (b) {
								createMessage.warn('集团无法删除');
							} else {
								if (checkboxRecords && checkboxRecords.length > 0) {
									deleteCorps(checkboxRecords);
								}
							}
						},
					},
				},
			},
		],
	},
	editRules: {
		code: [{ required: true, content: '必填字段' }],
		name: [{ required: true, content: '必填字段' }],
	},
});

const findCorps = () => {
	const condition = new Condition();
	condition.setTargetClass('lt.fw.core.model.biz.Corp');
	return new Promise<any[]>((resolve, reject) => {
		LtHttp.post({
			url: 'api/corpServiceImpl/findCorps',
			data: [condition],
		})
			.then((resp) => {
				const data = resp.map((item: any) => ({
					...item,
					hasChild: item.type !== 'FACTORY',
					parentId: get(item, 'parent.id'),
				}));
				resolve(data);
			})
			.catch(() => {
				reject();
			});
	});
};
const saveCorps = (value: any) => {
	LtHttp.post({
		url: 'api/corpServiceImpl/saveCorps',
		data: [value],
	}).then(() => {
		xGrid.value?.commitProxy('query');
	});
};

const deleteCorps = (value: any) => {
	LtHttp.post({
		url: 'api/corpServiceImpl/deleteCorps',
		data: [value],
	}).then(() => {
		xGrid.value?.commitProxy('query');
	});
};

function formatEnum(enumObj: any) {
	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
		enumObj[cellValue];
	return setDate;
}
</script>
