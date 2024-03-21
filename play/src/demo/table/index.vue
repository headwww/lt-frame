<template>
	<LTPageLayout dense contentFullHeight fixedHeight>
		<LTTable
			enable-toolbar
			is-editable
			checkbox-visibility
			:loading="loading"
			@refresh="findRoles"
			@remove="remove"
			@save="save"
			:colConfigs="colConfigs"
			:data="tableData"
			@current-change="currentChangeEvent"
		></LTTable>
	</LTPageLayout>
</template>

<script lang="ts" setup>
import {
	LTPageLayout,
	LTTable,
	EditTableProps,
	EditTableAttrs,
} from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnPropTypes, VxeColumnProps } from 'vxe-table';
import XEUtils from 'xe-utils';
import { parseRef } from '@lt-frame/utils';
import { LTHttp } from '../../application';

const tableData = ref([]);

const loading = ref(false);

function currentChangeEvent(item: any) {
	item;
}
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
				colConfigs: [{ field: 'name', title: '名称' }],
				// tableDate: [],
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
			} as EditTableProps,
			attrs: {
				// 配置下拉框的属性参考vxe-table文档
				vxePulldownAttrs: {},
				// 配置输入框的属性参考antv
				inputAttrs: {},
				// 使用EditTableAttrs
				tableAttrs: {},
			} as EditTableAttrs,
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
			// 参看antv的Api
			attrs: {
				placeholder: '必填',
				status: 'error',
			},
			events: {
				onChange: () => {
					console.log('Edit-Input');
				},
			},
		},
	},
	{
		field: 'corp.version',
		title: 'number',
		sortable: true,
		editRender: {
			name: 'Edit-InputNumber',
		},
	},
	{
		field: 'created',
		title: '日期数据',
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
			console.log(tableData.value);
		})
		.finally(() => {
			loading.value = false;
			// tableData.value = [];
		});
};
</script>
