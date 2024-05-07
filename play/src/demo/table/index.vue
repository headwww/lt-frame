<template>
	<LtPageLayout title="vxe-table">
		<vxe-grid class="lt-table-scrollbar" v-bind="gridOptions"></vxe-grid>
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	AdvanceFilterData,
	ComparisonOperator,
	FilterMode,
	LogicalOperators,
	LtPageLayout,
	TemporalOperator,
	LtToolBusinessProps,
	ToolBusinessOptions,
	LtToolFunctionProps,
	LtTablePlugins,
} from '@lt-frame/components';
import { useMessage } from '@lt-frame/hooks';
import { parse } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import dayjs from 'dayjs';
import { reactive } from 'vue';
import { VxeGlobalRendererHandles, VxeGridProps } from 'vxe-table';

enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}
const { createMessage } = useMessage();

const gridOptions = reactive<VxeGridProps>({
	editConfig: {},
	autoResize: true,
	height: 'auto',
	columns: [
		{ type: 'checkbox', width: 40 },
		{ type: 'seq', width: 40 },
		{
			width: 300,
			title: '操作',
			cellRender: {
				name: LtTablePlugins.CellOperate,
				props: {
					viewVisible: true,
					viewDisabled: (row: any) => row.id === '1',
					editVisible: true,
					editDisabled: (row: any) => row.id === '1',
					buttons: [
						{
							text: '按钮1',
							visible: (row: any) => row.id === '1',
							event: 'BTN1',
						},
						{
							text: '按钮2',
							//
							disabled: (row: any) => row.id === '1',
							event: 'BTN2',
						},
						{
							text: '按钮3',
							event: 'BTN3',
						},
					],
					menus: [
						{
							text: '菜单1',
							visible: (row: any) => row.id === '1',
							event: 'MENU1',
						},
						{
							text: '菜单2',
							disabled: (row: any) => row.id === '1',
							event: 'MENU2',
						},
						{
							text: '菜单3',
							disabled: true,
							event: 'MENU3',
						},
					],
				},
				events: {
					onViewClick: (params) => {
						console.log(params);
					},

					onItemClick: (event, params) => {
						console.log(event, params);
					},
				},
			},
			fixed: 'right',
			align: 'center',
		},
		{
			field: 'username',
			title: '用户名',
			width: '200',
			editRender: {
				name: '$lt-edit-input',
				props: {
					allowClear: true,
				},
			},
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.TEXT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
				},
			},
		},
		{
			field: 'version',
			title: '版本',
			width: '200',
			formatter: ['$lt-formatter-to-fixed-unit', 2, '元'],
			editRender: {
				name: '$lt-edit-input-number',
			},
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.NUMBER,
						// 数字筛选配置
						numberFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.NUMBER],
				},
			},
		},
		{
			field: 'created',
			title: '时间',
			width: '400',
			// formatter: ({ cellValue }) =>
			// 	XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss'),
			formatter: ['$lt-formatter-time', 'yyyy-MM-dd'],
			editRender: {
				name: '$lt-edit-date-picker',
				props: {
					showTime: false,
				},
			},
			filters: [
				{
					data: {
						currentMode: FilterMode.DATE,
						dateFilterData: {
							logicalOperators: LogicalOperators.AND,
							firstQueryCondition: TemporalOperator.EQUALS,
							// firstQueryText: dayjs('2021-12-21 13:12:30'),
							firstQueryText: dayjs('2018-05-31'),
							secondQueryCondition: TemporalOperator.EMPTY,
							secondQueryText: '',
						},
					} as AdvanceFilterData,
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.DATE],
					datePickerProps: {
						// showTime: { defaultValue: dayjs('00:00:00', 'HH:mm:ss') },
						format: 'YYYY-MM-DD',
					},
				},
			},
		},
		{
			field: 'corp.type',
			title: '类型',
			width: '200',
			formatter: ['$lt-formatter-enum', CorpType],
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
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.TEXT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
				},
			},
		},
		{
			field: 'corp.name',
			title: '公司名称',
			width: '800',
			filters: [
				{
					data: {
						currentMode: FilterMode.ENTITY,
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.ENTITY],
					configs: {
						columns: [
							{ type: 'checkbox', width: 40 },

							{
								field: 'name',
								title: '编码',
							},
							{
								field: 'code',
								title: '编码',
							},
						],
					},
					ajax: () => findCorps(),
				},
			},
			editRender: {
				name: LtTablePlugins.EditEntity,
				props: {
					configs: {
						enableSeq: true,
						columns: [
							{
								field: 'name',
								title: '编码',
							},
							{
								field: 'code',
								title: '编码',
							},
						],
					},
					ajax: () => findCorps(),
				},
			},
		},
	],
	proxyConfig: {
		ajax: {
			query: () => findRoles(),
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
							{
								event: '',
								text: '多选',
								divider: false,
								children: [
									{
										default: 'save',
										text: '保存',
									},
									{
										event: 'TEST1',
										text: '多选1',
									},
								],
							},
						],
					} as LtToolFunctionProps,
					events: {
						onSave: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							createMessage.success('保存');
							console.log(param);
						},
						onRemove: (param: VxeGlobalRendererHandles.RenderButtonParams) => {
							createMessage.success('删除');
							console.log(param);
						},
						onRefresh: () => {
							createMessage.success('刷新');
						},
						onItemClick: (event, params) => {
							console.log(event, params);
						},
					},
				},
			},
		],
		tools: [
			{
				toolRender: {
					name: '$lt-tool-business',
					props: {
						options: [
							{
								event: 'PASS',
								type: 'primary',
								text: '审核',
								disabled: (params) => {
									console.log(params);
									return false;
								},
								onClick: () => {
									console.log('审核');
								},
							},
							{
								event: 'END',
								type: 'default',
								text: '结束',
							},
						],
					} as LtToolBusinessProps,
					events: {
						onItemClick: (
							option: ToolBusinessOptions,
							params: VxeGlobalRendererHandles.RenderToolParams
						) => {
							createMessage.success(option.event);
							console.log(params);
						},
					},
				},
			},
		],
	},
	editRules: {
		username: [{ required: true, content: '必填字段' }],
		version: [
			{ type: 'number', min: 0, max: 100000, content: '输入 0 ~ 100000 范围' },
		],
		created: [{ required: true, content: '必填日期' }],
		type: [{ required: true, content: '必填字段' }],
		'corp.name': [{ required: true, content: '必填字段' }],
	},
});

// function formatEnum(enumObj: any) {
// 	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
// 		enumObj[cellValue];
// 	return setDate;
// }

const findRoles = () =>
	new Promise<any[]>((resolve, reject) => {
		LtHttp.post({
			url: 'api/securityModelService/findUsers',
			data: [
				{
					targetClass: 'lt.fw.core.model.biz.User',
					queryPath: [
						'username',
						'corp.name',
						'corp.id',
						'corp.code',
						'createdBy',
					],
				},
			],
		})
			.then((data) => {
				resolve(parse(data));
			})
			.catch(() => {
				reject();
			});
	});

const findCorps = () =>
	new Promise<any[]>((resolve, reject) => {
		LtHttp.post({
			url: 'api/corpServiceImpl/findCorps',
			data: [
				{
					targetClass: 'lt.fw.core.model.biz.Corp',
					queryPath: ['code', 'name', 'type'],
				},
			],
		})
			.then((data) => {
				resolve(parse(data));
			})
			.catch(() => {
				reject();
			}).finally;
	});
</script>
