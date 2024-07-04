<template>
	<LtPageLayout title="vxe-table">
		<vxe-grid
			ref="x"
			class="lt-table-scrollbar"
			v-bind="gridOptions"
		></vxe-grid>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout } from '@lt-frame/components';
import { parse } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';
import { onMounted, reactive, ref } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';

const x = ref<VxeGridInstance>();

const gridOptions = reactive<VxeGridProps>({
	editConfig: { trigger: 'dblclick' },
	autoResize: true,
	height: 'auto',
	columns: [
		{
			field: 'starTime',
			title: '用户名',
			width: '200',
			editRender: {
				name: '$lt-edit-time-picker',
			},
			formatter: '$lt-formatter-enum-hms',
		},
	],
	proxyConfig: {
		ajax: {
			query: () => findRoles(),
		},
	},
});

const findRoles = () =>
	new Promise<any[]>((resolve, reject) => {
		LtHttp.post({
			url: 'api/orderClassesService/findOrderClassess',
			data: [
				{
					targetClass: 'lt.app.productbasic.model.OrderClassesLine',
					queryPath: [],
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

onMounted(() => {
	false &&
		LtHttp.post({
			url: 'api/orderClassesService/saveOrderClassess',
			data: [
				[
					{
						name: '1212',
						corp: {
							id: '668865186018361344',
							version: 2,
						},
						starTime: 1720051202000,
					},
				],
				[],
			],
		})
			.then((data) => {
				console.log(data);
			})
			.catch(() => {
				console.log('====');
			});
});
</script>
