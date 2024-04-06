<template>
	<LTPageLayout style="position: relative">
		<LTFadeTransition>
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
				<div style="font-size: 16px">生产订单</div>

				<LTGrid :grid-configs="gridOptions"> </LTGrid>
			</div>
		</LTFadeTransition>
		<LTFadeTransition>
			<div
				v-show="visible"
				style="background: #fff; padding: 15px; position: absolute; width: 100%"
			>
				<LTDescription
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
				<LTGrid style="margin-top: 5px" :grid-configs="gridOptions2"> </LTGrid>
			</div>
		</LTFadeTransition>
		<Drawer st @register="register1" />
	</LTPageLayout>
</template>

<script setup lang="ts">
import {
	LTPageLayout,
	LTGrid,
	LTGridProps,
	LTDescription,
	LTButton,
	LTFadeTransition,
} from '@lt-frame/components';
import { parseRef } from '@lt-frame/utils';
import { computed, reactive, ref } from 'vue';
import { useDrawer } from '@lt-frame/hooks';
import { LTHttp } from '../../application';
import Drawer from './drawer.vue';

const [register1, { openDrawer }] = useDrawer();

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

const gridOptions2 = reactive<LTGridProps>({
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
</script>
