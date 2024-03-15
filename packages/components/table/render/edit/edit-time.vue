<template>
	<a-time-picker
		@change="handle"
		:value="getValue"
		v-bind="getAttrs"
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

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const getAttrs = computed(() => props.params?.column.editRender.attrs);

const getValue = computed(() =>
	dayjs(get(props.params?.row, props.params?.column.field!!))
);

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, Date.parse(value.toString()));
	}
};
</script>
