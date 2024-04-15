<template>
	<LtPageLayout style="position: relative">
		<LtFadeTransition>
			<div
				v-show="!visible"
				style="
					background-color: #fff;
					position: absolute;
					width: 100%;
					height: 100%;
					padding: 20px;
				"
			>
				<LtDivider title="生产订单"></LtDivider>
				<LtGrid :grid-configs="gridOptions"> </LtGrid>
			</div>
		</LtFadeTransition>
		<LtFadeTransition>
			<div
				v-show="visible"
				style="background: #fff; padding: 15px; position: absolute; width: 100%"
			>
				<LtForm :data="row" :items="formItems"></LtForm>
				<LtGrid style="margin-top: 5px" :grid-configs="gridOptions2"> </LtGrid>
			</div>
		</LtFadeTransition>
		<Drawer st @register="register1" />
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	LtPageLayout,
	LtGrid,
	LtGridProps,
	LtFadeTransition,
	LtForm,
	LtDivider,
	LtFormItems,
} from '@lt-frame/components';
import { parseRef } from '@lt-frame/utils';
import { reactive, ref } from 'vue';
import { useDrawer } from '@lt-frame/hooks';
import { LtHttp } from '../../application';
import Drawer from './drawer.vue';

const [register1, { openDrawer }] = useDrawer();

const visible = ref(false);

const row = ref();

const formItems = reactive<LtFormItems>([
	{
		field: 'id',
		title: 'id',
		span: 6,
		itemRender: { name: '$input' },
	},
	{
		field: 'code',
		title: 'code',
		span: 6,
		itemRender: { name: '$input' },
	},
	{
		field: 'checkDate',
		title: 'checkDate',
		span: 6,
		itemRender: { name: '$input' },
	},
	{
		field: 'createdBy',
		title: 'createdBy',
		span: 6,
		itemRender: { name: '$input' },
	},
]);

const gridOptions = reactive<LtGridProps>({
	height: 800,
	columns: [
		{
			field: 'id',
			title: 'id',
			editRender: {
				name: '$EditInput',
				props: {
					allowClear: true,
				},
			},
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

const gridOptions2 = reactive<LtGridProps>({
	height: 400,
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
		onViewClick: () => {
			openDrawer();
		},
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
		LtHttp.post({
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
		LtHttp.post({
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
</script>
