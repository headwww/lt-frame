<template>
	<LtPageLayout>
		<LtConfigTable
			:entity="'lt.app.product.model.ProductOrder'"
			v-model:config="options"
			:tUid="'ProductOrderManager_main'"
			tLabel="生产工单"
			v-model:fields="fields"
			@setup="findMain"
		>
			<template #table>
				<vxe-grid
					ref="mainGrid"
					class="lt-table-scrollbar"
					v-on="mainListeners"
					v-bind="options"
				>
				</vxe-grid>
			</template>
		</LtConfigTable>

		<LtConfigTable
			:entity="'lt.app.product.model.ProductOrder'"
			v-model:config="options"
			:tUid="'ProductOrderManager_main'"
			tLabel="生产工单"
			v-model:fields="fields"
			@setup="findMain"
		>
			<template #table>
				<vxe-grid
					ref="mainGrid"
					class="lt-table-scrollbar"
					v-on="mainListeners"
					v-bind="options"
				>
				</vxe-grid>
			</template>
		</LtConfigTable>
	</LtPageLayout>
</template>
<script setup lang="ts">
import { LtPageLayout } from '@lt-frame/components';
import { Condition } from '@lt-frame/utils';
import { LtConfigTable, LtHttp, PageResponse } from '@lt-frame/version-1';
import { reactive, ref } from 'vue';
import { VxeGridListeners, VxeGridProps } from 'vxe-table';

const fields = ref<string[]>([]);

const mainListeners = reactive<VxeGridListeners>({
	pageChange: ({ currentPage }) => {
		options.value.pagerConfig!.currentPage = currentPage;
		findMain();
	},
});
const options = ref<VxeGridProps>({
	height: 400,
	pagerConfig: {
		enabled: true,
		pageSize: 100,
		currentPage: 1,
	},
});

function findMain() {
	const page = {
		pageNo: options.value.pagerConfig!.currentPage! - 1,
		pageSize: 100,
		rowCountEnabled: true,
	};

	const condition = new Condition();
	condition.addQueryPath(...fields.value);
	condition.setTargetClass('lt.app.product.model.ProductOrder');

	LtHttp.post<PageResponse<any>>({
		url: `api/productOrderService/findmainsByPage`,
		data: [page, condition],
	}).then((resp) => {
		options.value.data = resp.result;
		options.value.pagerConfig!.total = resp.rowCount;
	});
}
</script>
