<template>
	<a-date-picker
		@ok="handle"
		@focus="focus"
		:status="status"
		v-model:value="time"
		style="width: 100%"
	>
	</a-date-picker>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { ref, type PropType } from 'vue';
import { DatePicker as ADatePicker } from 'ant-design-vue';
import { get, isNumber, set } from 'lodash-es';
import dayjs from 'dayjs';
import { isNullOrUnDef } from '@lt-frame/utils';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const status = ref<'' | 'error' | 'warning'>();

const time = ref();
const { params } = props;
if (params) {
	const { row, column } = params;
	const data = get(row, column.field);
	if (isNullOrUnDef(data)) {
		time.value = undefined;
	}
	if (isNumber(data)) {
		time.value = dayjs(data);
	}
}

const handle = async () => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		if (isNullOrUnDef(time.value)) {
			set(row, column.field, null);
		} else {
			set(row, column.field, Date.parse(time.value.toString()));
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
