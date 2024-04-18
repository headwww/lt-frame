<template>
	<div style="padding: 8px; font-size: 15px">
		<a-input
			v-model:value="inputValue"
			placeholder="模糊查询，请输入查询条件"
		></a-input>

		<vxe-grid v-bind="getGridConfigs" v-on="gridEvents"></vxe-grid>
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
import { VxeGridListeners, VxeGridInstance, VxeGridProps } from 'vxe-table';
import { Fn } from '@lt-frame/utils';
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
		type: Function as PropType<Fn<VxeGridInstance, Promise<any>>>,
	},
});

const inputValue = ref();

const filterRawData: Ref<Array<any>> = ref([]);

const getGridConfigs = reactive<VxeGridProps>(
	omit(props.configs, 'proxyConfig')
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
	const { ajax } = props;
	if (ajax) {
		getGridConfigs.loading = true;
		ajax()
			.then((data: any) => {
				getGridConfigs.data = data;
				filterRawData.value = data;
			})
			.finally(() => {
				getGridConfigs.loading = false;
			});
	}
}

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
