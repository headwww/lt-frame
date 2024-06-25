<!--
 * @Description: 币别维护界面
 * @Author: zjj
-->
<template>
	<LtPageLayout>
		<LtConfigTable
			entity="lt.app.common.model.Cexch"
			v-model:config="gridOptions"
			tUid="bbwh"
			@setup="
				findCexchs({
					pageNo: pager.currentPage && pager.currentPage - 1,
					pageSize: pager.pageSize,
					rowCountEnabled: true,
				})
			"
			:eventBus="eventBus"
			v-model:pager="pager"
			@pageChange="pageChange"
		>
			<template #table>
				<vxe-grid ref="xGrid" class="lt-table-scrollbar" v-bind="gridOptions">
				</vxe-grid>
			</template>
		</LtConfigTable>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import { LtPageLayout } from '@lt-frame/components';
import { useTableId } from '@lt-frame/hooks';
import { Condition } from '@lt-frame/utils';
import {
	LtConfigTable,
	LtHttp,
	PageResponse,
	Pager,
} from '@lt-frame/version-1';
import { ref } from 'vue';
import {
	VxeGridInstance,
	VxeGridProps,
	VxePagerDefines,
	VxePagerProps,
} from 'vxe-table';

defineOptions({
	name: 'CexchManager',
});

const xGrid = ref<VxeGridInstance>();

const { buildTableId } = useTableId();

console.log(buildTableId());

const eventBus = {
	insert: async () => {
		if (xGrid.value) {
			const { row } = await xGrid.value.insert({});
			xGrid.value?.setEditRow(row);
		}
	},
	refresh: () => {
		findCexchs({
			pageNo: pager.value.currentPage && pager.value.currentPage - 1,
			pageSize: pager.value.pageSize,
			rowCountEnabled: true,
		});
	},
	reset: () => {
		xGrid.value?.clearFilter();
	},
	remove: () => {},
};

const gridOptions = ref<VxeGridProps>({});

function pageChange(params: VxePagerDefines.PageChangeEventParams) {
	findCexchs({
		pageNo: params.currentPage - 1,
		pageSize: pager.value.pageSize,
		rowCountEnabled: true,
	});
}
function findCexchs(page: Pager) {
	gridOptions.value.loading = true;
	gridOptions.value.data = [];
	const condition = new Condition();
	findCexchsByPage<any>(page, condition).then((resp) => {
		gridOptions.value.loading = false;
		gridOptions.value.data = resp.result;
		pager.value.total = resp.rowCount;
	});
}

const pager = ref<VxePagerProps>({
	currentPage: 1,
	pageSize: 1,
});

function findCexchsByPage<T>(page: Pager, condition: Condition) {
	condition.setTargetClass('lt.app.common.model.Cexch');
	return LtHttp.post<PageResponse<T>>({
		url: 'api/cexchService/findCexchsByPage',
		data: [page, condition],
	});
}
</script>
