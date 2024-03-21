<template>
	<InputNumber
		v-bind="$attrs"
		:value="getValue"
		@update:value="handle"
		style="width: 100%"
	></InputNumber>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { computed, type PropType } from 'vue';
import { InputNumber } from 'ant-design-vue';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const getValue = computed(() => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		return get(row, column.field);
	}
	return '';
});

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, value);
	}
};
</script>
