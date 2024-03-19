<template>
	<div style="padding: 8px; font-size: 15px">
		<a-input
			v-bind="getInputAttrs"
			@update:value="handle"
			placeholder="模糊查询，请输入查询条件"
		/>
		<Table
			:loading="loading"
			v-bind="getTableAttrs"
			height="190"
			:enable-toolbar="false"
			:is-editable="false"
			:data="tableData"
			:checkbox-visibility="false"
		></Table>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
import { PropType, Ref, computed, onMounted, ref, unref } from 'vue';
import { isArray, isFunction, parseRef } from '@lt-frame/utils';
import Fuse from 'Fuse.js';
import Table from '../../../src/table.vue';
import { DeepFilterAttrs, EntityFilterConfig } from '../types';

const props = defineProps({
	event: {
		type: Object as PropType<{ [key: string]: (...args: any[]) => any }>,
	},
	attrs: {
		type: Object as PropType<DeepFilterAttrs>,
	},
	config: {
		type: Object as PropType<EntityFilterConfig>,
		default: () => ({}),
	},
});

const loading = ref(false);

const tableData: Ref<Array<any>> = ref([]);

const searchData: Ref<Array<any>> = ref([]);

const getInputAttrs = computed(() => {
	const { entityAttrs } = props.attrs as DeepFilterAttrs;
	if (entityAttrs) {
		const { inputAttrs } = entityAttrs;
		return inputAttrs;
	}
	return {};
});

const getTableAttrs = computed(() => {
	const { entityAttrs } = props.attrs as DeepFilterAttrs;
	if (entityAttrs) {
		const { tableAttrs } = entityAttrs;
		return tableAttrs;
	}
	return {};
});

const getColConfigs = computed(() => {
	const colConfigs = props.attrs?.entityAttrs?.tableAttrs.colConfigs;
	if (colConfigs) {
		return colConfigs;
	}
	return [];
});

const fuse = computed(() => {
	// 模糊查询的查找字段
	const keys = getColConfigs.value.map((item: any) => item.field);
	return new Fuse(searchData.value, {
		keys: keys as any,
		threshold: 0.3,
	});
});

const handle = (value: any) => {
	if (value === '') {
		tableData.value = searchData.value;
	} else {
		tableData.value = unref(fuse)
			.search(value)
			.map((match: any) => match.item);
	}
};

// 加载数据
const loadData = () => {
	loading.value = true;
	tableData.value = [];
	searchData.value = [];

	// attrs中配置的静态的数据
	const attrsData = props.attrs?.entityAttrs?.tableAttrs.data;
	if (isArray(attrsData)) {
		tableData.value = attrsData;
		searchData.value = attrsData;
	}

	// 事件中定义的请求来的数据
	const eventData = props.event?.data;
	if (eventData && isFunction(eventData)) {
		eventData()
			.then((data: any) => {
				tableData.value = parseRef(data);
				searchData.value = parseRef(data);
			})
			.finally(() => {
				loading.value = false;
			});
	} else {
		loading.value = false;
	}
};

onMounted(() => {
	loadData();
});
</script>
