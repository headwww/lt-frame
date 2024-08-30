<template>
	<vxe-pulldown
		popup-class-name="lt-edit-entity-popup-class-name"
		className="lt-edit-entity-class-name"
		ref="pulldownRef"
		transfer
	>
		<template #default>
			<InputSearch
				:status="status"
				v-model:value="inputValue"
				@focus="focus"
				@search="onSearch"
			>
			</InputSearch>
		</template>
		<template #dropdown>
			<vxe-grid
				class="lt-table-scrollbar"
				height="350"
				v-bind="getGridConfigs"
				v-on="gridEvents"
			></vxe-grid>
			<vxe-pager
				v-model:current-page="page.currentPage"
				v-model:page-size="page.pageSize"
				:total="page.total"
				:layouts="[
					'PrevJump',
					'PrevPage',
					'Jump',
					'PageCount',
					'NextPage',
					'NextJump',
					'Sizes',
				]"
				:pageSizes="[10, 20, 50, 100, 300, 500, 1000]"
			/>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { InputSearch } from 'ant-design-vue';
import { PropType, Ref, computed, reactive, ref, unref, watch } from 'vue';
import type {
	VxeGlobalRendererHandles,
	VxeGridListeners,
	VxeGridProps,
	VxePulldownInstance,
} from 'vxe-table';
import { get, join, omit, set, split } from 'lodash-es';
import Fuse from 'Fuse.js';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
	configs: {
		type: Object as PropType<VxeGridProps>,
		default: () => ({}),
	},
	ajax: {
		type: Function as PropType<(page: any, value?: string) => Promise<any>>,
	},
});

const getGridConfigs = reactive<VxeGridProps>(
	omit(props.configs, 'proxyConfig')
);

getGridConfigs.border = 'default';

const inputValue = ref(get(props.params!!.row, props.params!!.column.field));

const pulldownRef = ref<VxePulldownInstance>();

const filterRawData: Ref<Array<any>> = ref([]);

const status = ref<'' | 'error' | 'warning'>();

const page = reactive({
	currentPage: 1,
	pageSize: 100,
	total: 0,
});

watch(
	() => [page.currentPage, page.pageSize],
	() => {
		focus();
	}
);

watch(inputValue, (newVal) => {
	if (newVal === '') {
		getGridConfigs.data = filterRawData.value;
	} else {
		getGridConfigs.data = unref(fuse)
			.search(newVal)
			.map((match: any) => match.item);
	}
});

const fuse = computed(() => {
	// 模糊查询的查找字段
	const keys = getGridConfigs.columns?.map((item: any) => item.field);
	return new Fuse(filterRawData.value, {
		keys: keys as any,
		threshold: 0.3,
	});
});

function focus() {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		$table
			.validCellRules('change', row, column)
			.then(() => {
				status.value = '';
			})
			.catch(() => {
				status.value = 'error';
			});
	}

	getGridConfigs.data = [];
	filterRawData.value = [];

	const { ajax } = props;
	if (ajax) {
		getGridConfigs.loading = true;
		const pager = {
			pageNo: page.currentPage && page.currentPage - 1,
			pageSize: page.pageSize ? page.pageSize : 100,
			rowCountEnabled: true,
		};
		ajax(pager, inputValue.value)
			.then((data: any) => {
				getGridConfigs.data = data.result;
				page.total = data.rowCount;
				filterRawData.value = data.result;
			})
			.finally(() => {
				getGridConfigs.loading = false;
			});
	}

	const $pulldown = pulldownRef.value;
	$pulldown?.showPanel();
}

function onSearch() {
	page.currentPage = 1;
	page.total = 0;
	focus();
}

const gridEvents: VxeGridListeners<any> = {
	async currentChange({ row }) {
		const { params } = props;
		if (params) {
			const splitList = split(params.column.field, '.');
			if (splitList.length > 1) {
				const firstKey = splitList[0];
				splitList.shift();
				const otherKey = join(splitList, '.');
				inputValue.value = get(row, otherKey);
				set(params.row, firstKey, row);

				await params.$table.updateStatus(params);
				params.$table
					.validCellRules('change', params.row, params.column)
					.then(() => {
						status.value = '';
					})
					.catch(() => {
						status.value = 'error';
					});
			}
		}
		const $pulldown = pulldownRef.value;
		$pulldown?.hidePanel();
	},
};
</script>
