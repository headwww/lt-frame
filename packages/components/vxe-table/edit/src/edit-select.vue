<template>
	<Select
		@focus="focus"
		@change="change"
		:status="status"
		style="width: 100%"
		:value="getValue"
	>
	</Select>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { type PropType, computed, ref } from 'vue';
import { Select } from 'ant-design-vue';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderTableEditParams>,
});

const status = ref<'' | 'error' | 'warning'>();

const getValue = computed(() => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		return get(row, column.field);
	}
	return '';
});

const change = async (value: any) => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		set(row, column.field, value);
		await $table.updateStatus(params);
		($table as any)
			.validCellRules('change', row, column)
			.then(() => {
				status.value = '';
			})
			.catch(() => {
				status.value = 'error';
			});
	}
};

const focus = () => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		($table as any)
			.validCellRules('change', row, column)
			.then(() => {
				status.value = '';
			})
			.catch(() => {
				status.value = 'error';
			});
	}
};
</script>
