<template>
	<LtPageLayout dense contentFullHeight fixedHeight>
		<LtTable
			:loading="loading"
			:colConfigs="colConfigs"
			:data="tableData"
			enable-toolbar
		></LtTable>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import {
	FilterMode,
	LtPageLayout,
	LtTable,
	LogicalOperators,
	ComparisonOperator,
	TemporalOperator,
} from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnPropTypes, VxeColumnProps } from 'vxe-table';
import XEUtils from 'xe-utils';
import { parseRef } from '@lt-frame/utils';
import dayjs from 'dayjs';
import { LtHttp } from '../../application';

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
				},
			},
		],
		filterRender: {
			name: '$AdvancedFilter',
			props: {
				filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
			},
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
				},
			},
		],
		filterRender: {
			name: 'Filter-Deep',
			props: {
				filterModes: [FilterMode.NUMBER],
			},
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
				},
			},
		],
		filterRender: {
			name: '$AdvancedFilter',
			props: {
				filterModes: [FilterMode.DATE],
				datePickerProps: {
					showTime: true,
				},
			},
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

	LtHttp.post({
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
