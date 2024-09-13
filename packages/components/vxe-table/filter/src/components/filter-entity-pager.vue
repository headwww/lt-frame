<template>
	<div
		style="padding: 8px; font-size: 15px; display: flex; flex-direction: column"
	>
		<Input
			v-model:value="inputValue"
			placeholder="模糊查询，请输入查询条件"
			@input="onInput"
		>
		</Input>
		<vxe-grid
			class="lt-table-scrollbar"
			v-bind="getGridConfigs"
			v-on="gridEvents"
		></vxe-grid>
		<vxe-pager
			size="mini"
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
	</div>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import {
	PropType,
	Ref,
	computed,
	onMounted,
	reactive,
	ref,
	unref,
	watch,
} from 'vue';
import { debounce, omit } from 'lodash-es';
import Fuse from 'Fuse.js';
import { VxeGridListeners, VxeGridProps } from 'vxe-table';
import { EntityFilterData } from '../advanced-filter';

const props = defineProps({
	configs: {
		type: Object as PropType<VxeGridProps>,
		default: () => ({}),
	},
	filterData: {
		type: Object as PropType<EntityFilterData>,
		default: () => ({}),
	},
	ajax: {
		type: Function as PropType<(page: any, value?: string) => Promise<any>>,
	},
});

const page = reactive({
	currentPage: 1,
	pageSize: 100,
	total: 100000,
});

const inputValue = ref();

const filterRawData: Ref<Array<any>> = ref([]);

const getGridConfigs = reactive<VxeGridProps>(
	omit(props.configs, 'proxyConfig')
);
getGridConfigs.border = 'default';

const records = ref<any[]>([]);

const gridEvents: VxeGridListeners<any> = {
	checkboxChange(params) {
		records.value = params.$grid.getCheckboxRecords();
	},
};

getGridConfigs.height = 160;
getGridConfigs.border = 'full';

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

function getData() {
	getGridConfigs.data = [];
	filterRawData.value = [];
	// 实体编辑目前是内部把代理配置拿出来自己操作，后续有好的想法再更新
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
}

watch(
	() => [page.currentPage, page.pageSize],
	() => {
		getData();
	}
);

const onInput = debounce(() => {
	page.currentPage = 1;
	page.total = 0;
	getData();
}, 800);

onMounted(() => {
	getData();
});

function getFilterData() {
	return {
		records: records.value,
	};
}

defineExpose({ getFilterData });
</script>
