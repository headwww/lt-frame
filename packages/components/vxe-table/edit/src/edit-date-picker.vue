<template>
	<a-date-picker
		@change="handle"
		@ok="handle"
		@focus="focus"
		:status="status"
		:value="getValue"
		style="width: 100%"
	>
	</a-date-picker>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { computed, ref, type PropType } from 'vue';
import { DatePicker as ADatePicker } from 'ant-design-vue';
import { get, set } from 'lodash-es';
import dayjs from 'dayjs';
import { isNull, isNullOrUnDef } from '@lt-frame/utils';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const status = ref<'' | 'error' | 'warning'>();

const getValue = computed(() => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		const data = get(row, column.field);
		if (isNull(data)) {
			return undefined;
		}
		return dayjs(get(row, column.field));
	}
	return '';
});

const handle = async (value: any) => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		if (isNullOrUnDef(value)) {
			set(row, column.field, null);
		} else {
			set(row, column.field, Date.parse(value.toString()));
		}
		await $table.updateStatus(params);
		$table
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
		$table
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
