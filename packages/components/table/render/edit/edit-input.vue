<template>
	<Input
		v-bind="$attrs"
		:value="get(params?.row, params?.column.field!!)"
		@update:value="handle"
		:status="getStatus"
	></Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { useAttrs, type PropType } from 'vue';
import { useEdit } from './use-edit';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});
console.log(useAttrs());

const { getStatus } = useEdit(props.params);

const handle = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, value);
	}
};
</script>
