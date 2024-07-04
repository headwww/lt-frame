<template>
	<TimePicker
		@change="handle"
		@ok="handle"
		@focus="focus"
		:status="status"
		:value="getValue"
	>
	</TimePicker>
</template>

<script lang="ts" setup>
import { TimePicker } from 'ant-design-vue';
import { get, isNumber, set } from 'lodash-es';
import { computed, PropType, ref } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
import dayjs from 'dayjs';
import { isNullOrUnDef } from '@lt-frame/utils';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const status = ref<'' | 'error' | 'warning'>();

const getValue = computed(() => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		const data = get(row, column.field);
		if (isNullOrUnDef(data)) {
			return undefined;
		}
		if (isNumber(data)) {
			return dayjs(data);
		}
		return dayjs(data, 'HH:mm:ss');
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
