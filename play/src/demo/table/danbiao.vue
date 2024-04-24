<template>
	<LtPageLayout title="">
		<vxe-grid class="lt-table-scrollbar" v-bind="gridOptions"></vxe-grid>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtToolFunctionProps } from '@lt-frame/components';
import { LtHttp } from '@lt-frame/version-1';
import { concat } from 'lodash-es';
import { reactive } from 'vue';
import { VxeGlobalRendererHandles, VxeGridProps } from 'vxe-table';

const gridOptions = reactive<VxeGridProps>({
	editConfig: { trigger: 'dblclick', mode: 'row' },
	autoResize: true,
	height: 'auto',
	columns: [
		{ type: 'checkbox', width: 40 },
		{ type: 'seq', width: 40 },
		{
			width: 60,
			title: '操作',
			align: 'center',
			fixed: 'right',
			cellRender: {
				name: '$lt-cell-operate',
				props: {
					editVisible: true,
				},
			},
		},
		{
			field: 'name',
			title: '币别',
			width: '200',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},
		{
			field: 'code',
			title: '代号',
			width: '200',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
		},
		{
			field: 'isDefault',
			title: '是否默认',
			width: '200',
			formatter: ({ cellValue }) => (cellValue ? '是' : '否'),
			editRender: {
				name: '$lt-edit-select',
				props: {
					options: [
						{
							label: '是',
							value: true,
						},
						{
							label: '否',
							value: false,
						},
					],
				},
			},
		},
	],
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
								divider: false,
								preIcon: 'svg-icon:frame-delete',
							},
						],
					} as LtToolFunctionProps,
					events: {
						onSave: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							const { $grid } = param;
							if ($grid) {
								const { insertRecords, updateRecords } = $grid.getRecordset();
								const mergedArray = concat(insertRecords, updateRecords);
								if (mergedArray.length > 0) {
									LtHttp.post(
										{
											url: 'api/cexchService/saveCexchs',
											data: [mergedArray],
										},
										{ isParameters: true }
									).then(() => {
										param.$grid?.commitProxy('query');
									});
								}
							}
						},
						onRemove: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							const { $grid } = param;
							if ($grid) {
								const checkboxRecords = $grid.getCheckboxRecords();
								LtHttp.post(
									{
										url: 'api/cexchService/deleteCexchs',
										data: [checkboxRecords],
									},
									{ isParameters: true }
								).then(() => {
									param.$grid?.commitProxy('query');
								});
							}
						},
						onRefresh: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							param.$grid?.commitProxy('query');
						},
					},
				},
			},
		],
	},
	proxyConfig: {
		ajax: {
			query: () =>
				new Promise<any[]>((resolve, reject) => {
					LtHttp.post({
						url: 'api/cexchService/findCexchs',
						data: [
							{
								targetClass: 'lt.app.common.model.Cexch',
							},
						],
					})
						.then((data) => {
							resolve(data);
						})
						.catch(() => {
							reject();
						});
				}),
		},
	},
});
</script>
