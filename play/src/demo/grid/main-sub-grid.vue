<template>
	<LTPageLayout contentFullHeight fixedHeight>
		<div style="background: #fff; padding: 15px">
			<LTDescription
				v-show="visible"
				layout="vertical"
				bordered
				title="主表"
				:column="6"
				:data="row"
				:schema="getSchema"
			>
				<template #extra>
					<LTButton type="text" @click="visible = !visible">
						展开主表
					</LTButton>
				</template>
			</LTDescription>
		</div>

		<LTGrid v-show="!visible" :grid-configs="gridOptions"> </LTGrid>
		<LTGrid
			style="margin-top: 5px"
			v-show="visible"
			:grid-configs="gridOptions2"
		>
		</LTGrid>
	</LTPageLayout>
</template>

<script setup lang="ts">
import {
	LTPageLayout,
	LTGrid,
	LTGridProps,
	LTDescription,
	LTButton,
} from '@lt-frame/components';
import { parseRef } from '@lt-frame/utils';
import { computed, reactive, ref } from 'vue';
import { LTHttp } from '../../application';

const visible = ref(false);

const getSchema = computed(() => {
	const arr = gridOptions.columns?.map((item) => ({
		field: item.field!!,
		label: item.title!!,
	}));
	return arr;
});

const row = ref();

const gridOptions = reactive<LTGridProps>({
	columns: [
		{
			field: 'id',
			title: 'id',
		},
		{
			field: 'code',
			title: 'code',
		},
		{
			field: 'checkDate',
			title: 'checkDate',
		},
		{
			field: 'createdBy',
			title: 'createdBy',
		},
	],
	operateColumConfig: {
		viewVisible: true,
		onViewClick: async (params) => {
			row.value = params.row;
			visible.value = !visible.value;
			await findLines(params.row.id);
		},
	},
	proxyConfig: {
		ajax: {
			query: () => findMains(),
		},
	},
	toolbarConfig: {
		buttons: [
			{
				buttonRender: {
					name: '$ToolFunction',
					props: {},
					events: {},
				},
			},
		],
	},
});

const gridOptions2 = reactive<LTGridProps>({
	columns: [
		{
			field: 'id',
			title: 'id',
		},
		{
			field: 'batch',
			title: '批次',
		},
		{
			field: 'distributQuantity',
			title: 'distributQuantity',
		},
		{
			field: 'goods.property',
			title: 'goods.property',
		},
	],
	operateColumConfig: {
		viewVisible: true,
	},
	data: [],
	toolbarConfig: {
		buttons: [
			{
				buttonRender: {
					name: '$ToolFunction',
					props: {},
					events: {},
				},
			},
		],
	},
});

const findMains = () =>
	new Promise<any[]>((resolve, reject) => {
		LTHttp.post({
			url: 'api/productOrderServiceImpl/findMains',
			data: [
				{
					targetClass: 'lt.app.product.model.ProductOrder',
					queryPath: [
						'corp.name',
						'factory.name',
						'code',
						'dept.name',
						'process.name',
						'status',
					],
					// propertyParams: { id: '522059243654746112' },
				},
			],
		})
			.then((data) => {
				resolve(parseRef(data));
			})
			.catch(() => {
				reject();
			});
	});

const findLines = (id: string) =>
	new Promise<any[]>((resolve, reject) => {
		LTHttp.post({
			url: 'api/productOrderServiceImpl/findLines',
			data: [
				{
					targetClass: 'lt.app.product.model.ProductOrderLine',
					queryPath: [],
					propertyParams: { 'parent.id': id },
				},
			],
		})
			.then((data) => {
				gridOptions2.data = parseRef(data);
			})
			.catch(() => {
				reject();
			});
	});

// c.prop('id', '522059243654746112');
// c.prop('id', '522059738179964928');
// console.log(c);

// LTHttp.post({
// 	url: 'api/productOrderServiceImpl/findMains',
// 	data: [
// 		{
// 			targetClass: 'lt.app.product.model.ProductOrder',
// 			queryPath: [
// 				'corp.name',
// 				'factory.name',
// 				'code',
// 				'dept.name',
// 				'process.name',
// 				'status',
// 			],
// 			// propertyParams: { id: '522059243654746112' },
// 		},
// 	],
// })
// 	.then((data) => {
// 		console.log(parseRef(data));
// 	})
// 	.catch(() => {});
</script>
