<template>
	<InputNumber
		v-bind="getAttrs"
		:value="get(params?.row, params?.column.field!!)"
		@update:value="handle"
		style="width: 100%"
		:status="getStatus"
	></InputNumber>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { type PropType } from 'vue';
import { InputNumber } from 'ant-design-vue';
import { useEdit } from './use-edit';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const { getAttrs, getStatus } = useEdit(props.params);

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, value);
	}
};
</script>
