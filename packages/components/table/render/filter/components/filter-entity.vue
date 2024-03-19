<template>
	<div style="padding: 8px; font-size: 15px">
		<a-input v-bind="getInputAttrs" placeholder="模糊查询，请输入查询条件" />
		<Table
			:loading="loading"
			v-bind="getTableAttrs"
			height="190"
			:enable-toolbar="false"
			:is-editable="false"
			:checkbox-visibility="false"
		></Table>
	</div>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
import { PropType, Ref, computed, ref } from 'vue';
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

// 加载数据
const loadData = () => {
	loading.value = true;
	tableData.value = [];
	searchData.value = [];
};
loadData();
</script>
