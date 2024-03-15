<template>
	<InputNumber
		v-bind="getAttrs"
		:value="get(params?.row, params?.column.field!!)"
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

const getAttrs = computed(() => props.params?.column.editRender.attrs);

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, value);
	}
};
</script>
