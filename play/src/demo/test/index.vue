<template>
	<input type="text" />
	<LtPageLayout title="测试" dense contentFullHeight fixedHeight>
		<LtTable :loading="loading" :data="tableData" :colConfigs="colConfigs">
		</LtTable>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtTable } from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnProps } from 'vxe-table';
import { parseRef } from '@lt-frame/utils';
import { LtHttp } from '../../application';

const tableData = ref([]);
const loading = ref(false);

defineOptions({
	name: 'Test',
});

const colConfigs: VxeColumnProps[] = [
	{
		field: 'username',
	},
	{
		field: 'corp.name',
	},
	{
		field: 'corp.code',
	},
	{
		field: 'createdBy',
	},
];

onMounted(async () => {
	findRoles();
});
const findRoles = () => {
	loading.value = true;
	LtHttp.post({
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
			tableData.value = parseRef(data);
		})
		.finally(() => {
			loading.value = false;
			// tableData.value = [];
		});
};
</script>
