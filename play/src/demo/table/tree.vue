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
import { Condition, serialize } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import { cloneDeep, get, merge, omit, remove, uniqueId } from 'lodash-es';
import { reactive, ref } from 'vue';
import {
	VxeGridInstance,
	VxeGridProps,
	VxeGridListeners,
	VxeColumnPropTypes,
	VxeGlobalRendererHandles,
} from 'vxe-table';
import { toTreeArray } from 'xe-utils';

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
						parent: row,
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
	editConfig: { trigger: 'click', mode: 'row' },
	height: 'auto',
	stripe: false,
	checkboxConfig: {
		range: false,
		isShiftKey: false,
		checkStrictly: true,
	},
	treeConfig: {
		transform: true,
		rowField: '$id',
		parentField: '$parentId',
		hasChildField: 'hasChild',
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
		{
			field: 'id',
			title: 'id',
		},
		{
			field: 'parent.id',
			title: '父亲id',
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
								const a = toTreeArray(xGrid.value?.getTableData().fullData, {
									children: '_X_ROW_CHILD',
								});

								const mergedArray: any[] = [];
								a.forEach((item) => {
									if (
										xGrid.value?.isUpdateByRow(item) ||
										xGrid.value?.isInsertByRow(item)
									) {
										mergedArray.push(item);
									}
								});
								if (mergedArray.length > 0) {
									const cloneArr = cloneDeep(mergedArray);
									cloneArr.forEach((item) => {
										delete item.$_checked;
										delete item._X_ROW_CHILD;
										delete item.children;
										delete item.parent.children;
										delete item.parent._X_ROW_CHILD;
										delete item.$id;
										delete item.parent.$id;
										delete item.$parentId;
										delete item._X_ROW_KEY;
										delete item.parent._X_ROW_KEY;
									});
									saveCorps(mergedArray, cloneArr);
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
									const omitArr = checkboxRecords.map((item) =>
										omit(
											item,
											'children',
											'_X_ROW_CHILD',
											'parent.children',
											'parent._X_ROW_CHILD'
										)
									);

									deleteCorps(omitArr);
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
					$parentId: get(item, 'parent.id'),
					$id: get(item, 'id'),
				}));

				resolve(data);
			})
			.catch(() => {
				reject();
			});
	});
};

const saveCorps = (rawArr: any[], arr: any[]) => {
	LtHttp.post(
		{
			url: 'api/corpServiceImpl/saveCorps',
			data: serialize([arr]),
		},
		{ isParameters: true }
	).then((data) => {
		data[0].forEach((item: any, index: number) => {
			merge(rawArr[index], item);
		});

		xGrid.value?.removeInsertRow();
		arr.forEach((item) => xGrid.value?.reloadRow(item, {}));
	});
};

const deleteCorps = (value: any) => {
	LtHttp.post(
		{
			url: 'api/corpServiceImpl/deleteCorps',
			data: [value],
		},
		{ isParameters: true }
	).then((data) => {
		// xGrid.value?.commitProxy('query');
		const a = toTreeArray(xGrid.value?.getTableData().fullData, {
			children: '_X_ROW_CHILD',
		});
		const d = data[0];
		d.forEach((element: any) => {
			remove(a, (item) => item.id === element.id);
		});
		xGrid.value?.loadData(a);
	});
};

function formatEnum(enumObj: any) {
	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
		enumObj[cellValue];
	return setDate;
}
</script>
