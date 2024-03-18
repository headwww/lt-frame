<template>
	<LTPageLayout dense contentFullHeight fixedHeight>
		<LTTable
			:loading="loading"
			@refresh="findRoles"
			@remove="remove"
			@save="save"
			:colConfigs="colConfigs"
			:data="tableData"
		></LTTable>
	</LTPageLayout>
</template>

<script lang="ts" setup>
import {
	DeepFilterConfig,
	FilterMode,
	LTPageLayout,
	LTTable,
	LogicalOperators,
	QueryConditions,
} from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnPropTypes, VxeColumnProps } from 'vxe-table';
import XEUtils from 'xe-utils';
import { parseRef } from '@lt-frame/utils';
import { LTHttp } from '../../application';

const tableData = ref([]);

const loading = ref(false);

function save(data: any, recordset: any) {
	loading.value = true;
	setTimeout(() => {
		loading.value = false;
		console.log(data, recordset);
		findRoles();
	}, 2000);
}

function remove(data: any) {
	console.log(data);
	loading.value = true;
	setTimeout(() => {
		loading.value = false;
		findRoles();
	}, 2000);
}

enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}

const colConfigs: VxeColumnProps[] = [
	{
		field: 'corp.name',
		title: 'entity',
		sortable: true,
		params: {
			// 是否是必填字段
			notNull: true,
		},
		editRender: {
			name: 'Edit-Table',
			props: {
				data: () =>
					LTHttp.post({
						url: 'api/corpService/findCorps',
						data: [
							{
								targetClass: 'com.ltscm.laf.application.model.Corp',
								queryPath: [],
							},
						],
					}),
			},
			events: {
				data: () =>
					LTHttp.post({
						url: 'api/corpService/findCorps',
						data: [
							{
								targetClass: 'com.ltscm.laf.application.model.Corp',
								queryPath: [],
							},
						],
					}),
			},
			attrs: {
				// 配置下拉框的属性参考vxe-table文档
				// vxePulldownAttrs: {},
				// 配置输入框的属性参考antv
				// inputAttrs: {},
				tableAttrs: {
					colConfigs: [
						{
							field: 'name',
							title: '名称',
						},
						{
							field: 'code',
							title: '编码',
						},
						{
							field: 'code',
							title: '编码',
						},
						{
							field: 'code',
							title: '编码',
							width: 200,
						},
						{
							field: 'code',
							title: '编码',
						},
						{
							field: 'code',
							title: '编码',
						},
					],
					// 直接配置静态数据
					// data: tableData,
				},
			},
		},
	},
	{
		field: 'name',
		title: 'string',
		params: {
			// 是否是必填字段
			notNull: true,
		},
		editRender: {
			name: 'Edit-Input',
			attrs: {
				placeholder: '必填',
			},
		},
		filters: [
			{
				data: {
					// 设置开启的筛选方式
					filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
					// 选中的筛选方式
					currentFilterMode: FilterMode.TEXT,
					// 文本筛选配置
					textFilterConfig: {
						// 两个条件之间的逻辑操作
						logicalOperators: LogicalOperators.AND,
						// 第一个查询条件
						firstQueryCondition: QueryConditions.INCLUDE,
						// 第一个查询文本
						firstQueryText: '',
						// 第二个查询条件
						secondQueryCondition: QueryConditions.EMPTY,
						// 第二个查询文本
						secondQueryText: '',
					},
				} as DeepFilterConfig,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
		},
	},
	{
		field: 'corp.version',
		title: 'number',
		editRender: {
			name: 'Edit-InputNumber',
		},
		filters: [
			{
				data: {
					// 设置开启的筛选方式
					filterModes: [FilterMode.NUMBER, FilterMode.CONTENT],
					// 选中的筛选方式
					currentFilterMode: FilterMode.NUMBER,
					// 数字筛选配置
					numberFilterConfig: {
						// 两个条件之间的逻辑操作
						logicalOperators: LogicalOperators.AND,
						// 第一个查询条件
						firstQueryCondition: QueryConditions.INCLUDE,
						// 第一个查询文本
						firstQueryText: '',
						// 第二个查询条件
						secondQueryCondition: QueryConditions.EMPTY,
						// 第二个查询文本
						secondQueryText: '',
					},
				} as DeepFilterConfig,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
		},
	},
	{
		field: 'updated',
		title: 'date',
		formatter: formatDate('yyyy年MM月dd日 HH时mm分ss秒'),
		editRender: {
			name: 'Edit-Time',
			attrs: {
				format: 'HH时mm分ss秒',
			},
		},
	},
	{
		field: 'created',
		title: 'date',
		formatter: formatDate('yyyy年MM月dd日 HH时mm分ss秒'),
		editRender: {
			name: 'Edit-Date',
			attrs: {
				showTime: true,
			},
		},
	},
	{
		field: 'corp.type',
		title: '公司类型',
		formatter: formatEnum(CorpType),
		params: {
			// 是否是必填字段
			notNull: true,
		},
		editRender: {
			name: 'Edit-Select',
			attrs: {
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
];

function formatDate(format = 'yyyy-MM-dd HH:mm:ss') {
	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
		XEUtils.toDateString(cellValue, format);
	return setDate;
}

function formatEnum(enumObj: any) {
	const setDate: VxeColumnPropTypes.Formatter = ({ cellValue }) =>
		enumObj[cellValue];
	return setDate;
}

onMounted(async () => {
	findRoles();
});

const findRoles = () => {
	loading.value = true;

	LTHttp.post({
		url: 'api/securityModelManager/findRoles',
		data: [
			{
				targetClass: 'com.ltscm.laf.security.model.Role',
				queryPath: [
					'created',
					'corp.name',
					'corp.id',
					'corp.code',
					'createdBy.name',
				],
			},
		],
	})
		.then((data) => {
			tableData.value = parseRef(data);
		})
		.finally(() => {
			loading.value = false;
			// tableData.value = [];
		});
};
</script>
