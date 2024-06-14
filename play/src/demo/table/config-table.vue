<template>
	<LtPageLayout title="配置表单">
		<LtConfigTable
			entity="lt.fw.core.model.biz.User"
			v-model:config="gridOptions"
			:event-bus="event"
			:datasource="datasource"
			@setup="findRoles"
		>
			<template #table>
				<vxe-grid
					class="lt-table-scrollbar"
					ref="xGrid"
					v-bind="gridOptions"
				></vxe-grid>
			</template>
		</LtConfigTable>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout } from '@lt-frame/components';
import { LtConfigTable, LtHttp } from '@lt-frame/version-1';
import { ref, watch } from 'vue';
import { VxeGridProps } from 'vxe-table';

const gridOptions = ref<VxeGridProps>({});

watch(
	() => gridOptions.value,
	() => {}
);

const b = ref(true);

const xGrid = ref();

const datasource = {
	自定义数据源: () =>
		new Promise((resolve, reject) => {
			LtHttp.post({
				url: 'api/corpServiceImpl/findCorps',
				data: [
					{
						targetClass: 'lt.fw.core.model.biz.Corp',
						queryPath: ['code', 'name', 'type'],
					},
				],
			})
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					reject();
				}).finally;
		}),
	自定义数据源2: () => b.value,
};

watch(b, () => {
	console.log(b.value);
});

const event = {
	刷新: () => {
		findRoles();
	},
	新增操作: () => {
		findRoles();
	},
	删除操作: () => {
		console.log('xGrid.value');
	},
	控制按钮的状态: () => {
		b.value = !b.value;
	},
};

function findRoles() {
	gridOptions.value.maxHeight = 800;
	gridOptions.value.autoResize = true;
	gridOptions.value.loading = true;
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
	}).then((data) => {
		gridOptions.value.loading = false;
		gridOptions.value.data = data;
	});
}
</script>
