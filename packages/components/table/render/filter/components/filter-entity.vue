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
			:col-configs="getColConfigs"
			:data="data"
			:empty-render="{ name: 'LT-Empty' }"
			@current-change="(item: any) => currentChangeEvent(item.row)"
		></Table>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
import { PropType, Ref, computed, onMounted, ref, unref } from 'vue';
import { isArray, isFunction, parseRef } from '@lt-frame/utils';
import Fuse from 'Fuse.js';
import { omit } from 'lodash-es';
import Table from '../../../src/table.vue';
import { EntityFilterConfig } from '../types';
import { EntityConfig } from '../filter-deep';

const props = defineProps({
	entityConfig: {
		type: Object as PropType<EntityConfig>,
	},
	attrs: {
		type: Object as PropType<any>,
	},
	config: {
		type: Object as PropType<EntityFilterConfig>,
		default: () => ({}),
	},
});

const loading = ref(false);

const data: Ref<Array<any>> = ref([]);

const searchData: Ref<Array<any>> = ref([]);

const rowEntity = ref();

const getInputAttrs = computed(() => {
	const { inputAttrs } = props.attrs;
	if (inputAttrs) {
		return inputAttrs;
	}
	return {};
});

const getTableAttrs = computed(() => {
	const { entityAttrs } = props.attrs;
	if (entityAttrs) {
		const { tableAttrs } = entityAttrs;
		return omit(tableAttrs, 'data', 'colConfigs');
	}
	return {};
});

const getColConfigs = computed(() => {
	const { entityConfig } = props;
	if (entityConfig) {
		const { colConfigs } = entityConfig;
		if (colConfigs) {
			return colConfigs;
		}
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
		data.value = searchData.value;
	} else {
		data.value = unref(fuse)
			.search(value)
			.map((match: any) => match.item);
	}
};

// 加载数据
const loadData = () => {
	data.value = [];
	searchData.value = [];

	const { entityConfig } = props;
	if (entityConfig) {
		loading.value = true;
		const { tableDate, tableDatePromise } = entityConfig;
		// attrs中配置的静态的数据
		if (tableDate && isArray(tableDate)) {
			data.value = tableDate;
			searchData.value = tableDate;
		}

		// 事件中定义的请求来的数据
		if (tableDatePromise && isFunction(tableDatePromise)) {
			tableDatePromise()
				.then((resp: any) => {
					data.value = parseRef(resp);
					searchData.value = parseRef(resp);
				})
				.finally(() => {
					loading.value = false;
				});
		} else {
			loading.value = false;
		}
	}
};

function currentChangeEvent(row: any) {
	rowEntity.value = row;
}

function getConfig() {
	return {
		currentRow: rowEntity.value,
	};
}

defineExpose({ getConfig });

onMounted(() => {
	loadData();
});
</script>
