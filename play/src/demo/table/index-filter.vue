<template>
	<LTPageLayout dense contentFullHeight fixedHeight>
		<LTTable
			:loading="loading"
			:colConfigs="colConfigs"
			:data="tableData"
		></LTTable>
	</LTPageLayout>
</template>

<script lang="ts" setup>
import {
	FilterMode,
	LTPageLayout,
	LTTable,
	LogicalOperators,
	ComparisonOperator,
	TemporalOperator,
	FilterDeepProps,
	FilterDeepAttrs,
	FilterDeepRef,
} from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnPropTypes, VxeColumnProps } from 'vxe-table';
import XEUtils from 'xe-utils';
import { parseRef } from '@lt-frame/utils';
import dayjs from 'dayjs';
import { LTHttp } from '../../application';

const tableData = ref([]);

const loading = ref(false);
enum CorpType {
	HEAD = '集团',
	SUBSIDIARY = '公司',
	FACTORY = '工厂',
}
const colConfigs: VxeColumnProps[] = [
	{
		field: 'name',
		title: 'string',
		filters: [
			{
				data: {
					// 选中的筛选方式
					currentFilterMode: FilterMode.TEXT,
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
				} as FilterDeepRef,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
			} as FilterDeepProps,
		},
	},
	{
		field: 'corp.version',
		title: 'number',
		sortable: true,
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
				} as FilterDeepRef,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.NUMBER],
			},
			attrs: {
				numberAttrs: {},
			} as FilterDeepAttrs,
		},
	},
	{
		field: 'created',
		title: '日期数据',
		formatter: formatDate('yyyy年MM月dd日 HH时mm分ss秒'),
		filters: [
			{
				data: {
					filterModes: [FilterMode.DATE],
					currentFilterMode: FilterMode.DATE,
					dateFilterConfig: {
						logicalOperators: LogicalOperators.AND,
						firstQueryCondition: TemporalOperator.EQUALS,
						firstQueryText: dayjs('2021-12-21 13:12:30'),
						secondQueryCondition: TemporalOperator.EMPTY,
						secondQueryText: '',
					},
				} as FilterDeepRef,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.DATE],
			},
			attrs: {
				dateAttrs: {
					showTime: true,
					format: 'YYYY年MM月DD日 HH时mm分ss秒',
				},
			} as FilterDeepAttrs,
		},
	},
	{
		field: 'corp.type',
		title: '公司类型',
		formatter: formatEnum(CorpType),
		filters: [
			{
				data: {
					currentFilterMode: FilterMode.CONTENT,
					contentFilterConfig: {
						checkedKeys: ['$_SELECT_ALL'],
					},
				} as FilterDeepRef,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.CONTENT],
			},
		},
	},
	{
		field: 'corp.name',
		title: 'entity',
		sortable: true,
		filters: [
			{
				data: {
					// 选中的筛选方式
					currentFilterMode: FilterMode.ENTITY,
					entityFilterConfig: {
						currentRow: '',
					},
				} as FilterDeepRef,
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.ENTITY],
				entityConfig: {
					compareField: 'name',
					colConfigs: [
						{
							field: 'name',
							title: '名称',
							width: 300,
						},
						{
							field: 'code',
							title: '编码',
							width: 200,
						},
					],
					tableDatePromise: () =>
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
			} as FilterDeepProps,
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
