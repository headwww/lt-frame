<template>
	<Input
		@focus="focus"
		:status="status"
		:value="getValue"
		@update:value="handle"
	></Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { computed, ref, type PropType } from 'vue';

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

const handle = async (value: any) => {
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
