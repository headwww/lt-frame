<template>
	<div style="padding: 8px; font-size: 15px">
		<a-input
			v-model:value="inputValue"
			placeholder="模糊查询，请输入查询条件"
		></a-input>

		<LTGrid :grid-configs="getGridConfigs" v-on="gridEvents"></LTGrid>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
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
import { omit } from 'lodash-es';
import Fuse from 'Fuse.js';
import { VxeGridListeners } from 'vxe-table';
import LTGrid from '../../../../src/grid.vue';
import { EntityFilterConfig } from '../advanced-filter';
import { LTGridProps } from '../../../../src/grid';

const props = defineProps({
	gridConfigs: {
		type: Object as PropType<LTGridProps>,
		default: () => ({}),
	},
	config: {
		type: Object as PropType<EntityFilterConfig>,
		default: () => ({}),
	},
});

const inputValue = ref();

const filterRawData: Ref<Array<any>> = ref([]);

const getGridConfigs = reactive<LTGridProps>(
	omit(props.gridConfigs, 'proxyConfig')
);

const records = ref<any[]>([]);

const gridEvents: VxeGridListeners<any> = {
	checkboxChange(params) {
		records.value = params.$grid.getCheckboxRecords();
	},
};
getGridConfigs.height = 190;

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
	const { proxyConfig } = props.gridConfigs;
	if (proxyConfig) {
		const { dataSource } = proxyConfig;
		if (dataSource) {
			getGridConfigs.loading = true;
			dataSource()
				.then((data: any) => {
					getGridConfigs.data = data;
					filterRawData.value = data;
				})
				.finally(() => {
					getGridConfigs.loading = false;
				});
		}
	}
}

onMounted(() => {
	getData();
});

function getConfig() {
	return {
		records: records.value,
	};
}

defineExpose({ getConfig });
</script>
