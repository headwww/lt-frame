<template>
	<LTPageLayout title="配置表单" dense contentFullHeight fixedHeight>
		<LTGrid :grid-configs="gridOptions"></LTGrid>
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
} from '@lt-frame/components';
import { reactive } from 'vue';
import { parseRef } from '@lt-frame/utils';
import XEUtils from 'xe-utils';
import { VxeColumnPropTypes } from 'vxe-table';
import { FilterMode } from '@lt-frame/components/grid';
import dayjs from 'dayjs';
import { LTHttp } from '../../application';

enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}

const gridOptions = reactive<LTGridProps>({
	enableSeq: true,
	enableCheckbox: true,
	enableEdit: true,
	columns: [
		{
			field: 'corp.name',
			title: '公司名称',
			width: '200',
			editRender: {
				name: '$editEntity',
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
				name: '$advancedFilter',
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
				name: '$editInput',
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
				name: '$editInputNumber',
				// name: 'input',
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
				name: '$advancedFilter',
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
				name: '$editDatePicker',
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
				name: '$advancedFilter',
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
				name: '$editSelect',
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
				name: '$advancedFilter',
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
