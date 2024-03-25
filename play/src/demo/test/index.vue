<template>
	<input type="text" />
	<LTPageLayout title="测试" dense contentFullHeight fixedHeight>
		<LTTable :loading="loading" :data="tableData" :colConfigs="colConfigs">
		</LTTable>
	</LTPageLayout>
</template>

<script setup lang="ts">
import { LTPageLayout, LTTable } from '@lt-frame/components';
import { onMounted, ref } from 'vue';
import { VxeColumnProps } from 'vxe-table';
import { parseRef } from '@lt-frame/utils';
import { LTHttp } from '../../application';

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
			tableData.value = parseRef(data);
		})
		.finally(() => {
			loading.value = false;
			// tableData.value = [];
		});
};
</script>
