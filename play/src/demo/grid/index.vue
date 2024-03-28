<template>
	<LTPageLayout title="配置表单" contentFullHeight fixedHeight>
		<LTGrid :grid-configs="gridOptions"> </LTGrid>
	</LTPageLayout>
</template>

<script setup lang="ts">
import {
	LTPageLayout,
	LTGrid,
	LTGridProps,
	AdvanceFilterProps,
	AdvanceFilterData,
	LogicalOperators,
	ComparisonOperator,
	TemporalOperator,
	ToolBusinessProps,
} from '@lt-frame/components';
import { reactive } from 'vue';
import { parseRef } from '@lt-frame/utils';
import XEUtils from 'xe-utils';
import { VxeColumnPropTypes } from 'vxe-table';
import { FilterMode, ToolBusinessOptions } from '@lt-frame/components/grid';
import dayjs from 'dayjs';
import { useMessage } from '@lt-frame/hooks';
import { LTHttp } from '../../application';

enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}

const { createMessage } = useMessage();

const gridOptions = reactive<LTGridProps>({
	enableSeq: true,
	enableCheckbox: true,
	enableEdit: true,
	height: 800,
	operateColumConfig: {
		width: 300,
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
		onViewClick: (params) => {
			console.log(params);
		},

		onButtonsItemClick: (event, params) => {
			console.log(event, params);
		},
		onMenusItemClick: (event, params) => {
			console.log(event, params);
		},
	},
	columns: [
		{
			field: 'corp.name',
			title: '公司名称',
			width: '800',
			editRender: {
				name: '$EditEntity',
				props: {
					gridConfigs: {
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
						proxyConfig: {
							// 自定义的代理方案，调用实体筛选不使用ajax的方式
							dataSource: () => findCorps(),
						},
					} as LTGridProps,
				},
			},
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentFilterMode: FilterMode.ENTITY,
						// 文本筛选配置
						textFilterConfig: {
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
						// 内容筛选
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					} as AdvanceFilterData,
				},
			],
			filterRender: {
				name: '$AdvancedFilter',
				props: {
					filterModes: [FilterMode.ENTITY, FilterMode.TEXT, FilterMode.CONTENT],
					gridConfigs: {
						enableSeq: true,
						enableCheckbox: true,
						checkboxConfig: {
							trigger: 'row',
						},
						columns: [
							{
								field: 'name',
								title: '编码',
							},
							{
								field: 'code',
								title: '编码',
							},
							{
								field: 'created',
								title: '日期',
								formatter: ({ cellValue }) =>
									XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss'),
							},
						],
						proxyConfig: {
							// 自定义的代理方案，调用实体筛选不使用ajax的方式
							dataSource: () => findCorps(),
						},
					},
				} as AdvanceFilterProps,
			},
		},
		{
			field: 'username',
			title: '用户名',
			width: '200',
			editRender: {
				name: '$EditInput',
				props: {
					allowClear: true,
				},
			},
		},
		{
			field: 'version',
			title: '版本',
			width: '200',
			editRender: {
				name: '$EditInputNumber',
			},
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentFilterMode: FilterMode.NUMBER,
						// 数字筛选配置
						numberFilterConfig: {
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
				name: '$AdvancedFilter',
				props: {
					filterModes: [FilterMode.NUMBER],
				},
			},
		},
		{
			field: 'created',
			title: '用户名',
			width: '200',
			formatter: ({ cellValue }) =>
				XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:mm:ss'),
			editRender: {
				name: '$EditDatePicker',
				props: {
					showTime: true,
				},
			},
			filters: [
				{
					data: {
						currentFilterMode: FilterMode.DATE,
						dateFilterConfig: {
							logicalOperators: LogicalOperators.AND,
							firstQueryCondition: TemporalOperator.EQUALS,
							firstQueryText: dayjs('2021-12-21 13:12:30'),
							secondQueryCondition: TemporalOperator.EMPTY,
							secondQueryText: '',
						},
					} as AdvanceFilterData,
				},
			],
			filterRender: {
				name: '$AdvancedFilter',
				props: {
					filterModes: [FilterMode.DATE],
					datePickerProps: {
						showTime: true,
					},
				} as AdvanceFilterProps,
			},
		},
		{
			field: 'corp.type',
			title: '类型',
			width: '200',
			formatter: formatEnum(CorpType),
			editRender: {
				name: '$EditSelect',
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
						currentFilterMode: FilterMode.CONTENT,
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					},
				},
			],
			filterRender: {
				name: '$AdvancedFilter',
				props: {
					filterModes: [FilterMode.CONTENT],
				},
			},
		},
	],
	proxyConfig: {
		ajax: {
			query: () => findRoles(),
		},
	},
	editRules: {
		username: [{ required: true, message: '必填字段' }],
		version: [
			{ type: 'number', min: 0, max: 100000, message: '输入 0 ~ 100000 范围' },
		],
		created: [{ required: true, message: '必填日期' }],
		type: [{ required: true, message: '必填字段' }],
		'corp.name': [{ required: true, message: '必填字段' }],
	},
	toolbarConfig: {
		buttons: [
			{
				buttonRender: {
					name: '$ToolFunction',
					props: {},
					events: {
						onSave: (param: any) => {
							createMessage.success('保存');
							console.log(param);
						},
						onRemove: (records: any) => {
							createMessage.success('删除');
							console.log(records);
						},
						onRefresh: () => {
							createMessage.success('刷新');
						},
					},
				},
			},
		],
		tools: [
			{
				toolRender: {
					name: '$ToolBusiness',
					props: {
						options: [
							{
								event: 'PASS',
								type: 'primary',
								text: '审核',
								disabled: false,
							},
							{
								event: 'END',
								type: 'default',
								text: '结束',
							},
						],
					} as ToolBusinessProps,
					events: {
						onItemClick: (option: ToolBusinessOptions, params: any) => {
							createMessage.success(option.event);
							console.log(params);
						},
					},
				},
			},
		],
	},
});

function formatEnum(enumObj: any) {
	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
		enumObj[cellValue];
	return setDate;
}

const findCorps = () =>
	new Promise<any[]>((resolve, reject) => {
		LTHttp.post({
			url: 'api/corpServiceImpl/findCorps',
			data: [
				{
					targetClass: 'lt.fw.core.model.biz.Corp',
					queryPath: ['code', 'name', 'type'],
				},
			],
		})
			.then((data) => {
				resolve(parseRef(data));
			})
			.catch(() => {
				reject();
			}).finally;
	});

const findRoles = () =>
	new Promise<any[]>((resolve, reject) => {
		LTHttp.post({
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
				resolve(parseRef(data));
			})
			.catch(() => {
				reject();
			}).finally;
	});

// const findRoles = () => {
// 	gridOptions.loading = true;
// 	LTHttp.post({
// 		url: 'api/securityModelService/findUsers',
// 		data: [
// 			{
// 				targetClass: 'lt.fw.core.model.biz.User',
// 				queryPath: [
// 					'username',
// 					'corp.name',
// 					'corp.id',
// 					'corp.code',
// 					'createdBy',
// 				],
// 			},
// 		],
// 	})
// 		.then((data) => {
// 			gridOptions.data = parseRef(data);
// 		})
// 		.finally(() => {
// 			gridOptions.loading = false;
// 			// tableData.value = [];
// 		});
// };
</script>
