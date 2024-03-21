<template>
	<Input v-bind="$attrs" :value="getValue" @update:value="handle"></Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { computed, type PropType } from 'vue';

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
