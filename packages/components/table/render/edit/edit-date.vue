<template>
	<a-date-picker
		@change="handle"
		@ok="handle"
		:value="getValue"
		v-bind="getAttrs"
		style="width: 100%"
		:status="getStatus"
	>
	</a-date-picker>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { computed, type PropType } from 'vue';
import { DatePicker as ADatePicker } from 'ant-design-vue';
import { get, set } from 'lodash-es';
import dayjs from 'dayjs';
import { isNull, isNullOrUnDef } from '@lt-frame/utils';
import { useEdit } from './use-edit';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const { getAttrs, getStatus } = useEdit(props.params);

const getValue = computed(() => {
	const data = get(props.params?.row, props.params?.column.field!!);
	if (isNull(data)) {
		return undefined;
	}
	return dayjs(get(props.params?.row, props.params?.column.field!!));
});

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		if (isNullOrUnDef(value)) {
			set(params.row, params.column.field, null);
		} else {
			set(params.row, params.column.field, Date.parse(value.toString()));
		}
	}
};
</script>
