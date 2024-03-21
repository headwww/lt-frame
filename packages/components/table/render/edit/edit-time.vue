<template>
	<a-time-picker
		@change="handle"
		:value="getValue"
		v-bind="attrs"
		style="width: 100%"
	>
	</a-time-picker>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { computed, type PropType } from 'vue';
import { TimePicker as ATimePicker } from 'ant-design-vue';
import { get, set } from 'lodash-es';
import dayjs from 'dayjs';
import { isNull, isNullOrUnDef } from '@lt-frame/utils';
import { useAttrs } from '@lt-frame/hooks';

defineOptions({
	name: 'LTEditTime',
	inheritAttrs: false,
});

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const attrs = useAttrs({ excludeKeys: ['onChange'] });

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
