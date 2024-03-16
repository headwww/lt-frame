<template>
	<a-select
		@change="change"
		style="width: 100%"
		v-bind="getAttrs"
		:value="getValue"
		:status="getStatus"
	>
	</a-select>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { type PropType, computed } from 'vue';
import { Select as ASelect } from 'ant-design-vue';
import { useEdit } from './use-edit';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const { getAttrs, getStatus } = useEdit(props.params);

const change = (value: any) => {
	const { params } = props;
	if (params) {
		set(params.row, params.column.field, value);
	}
};

const getValue = computed(() =>
	get(props.params?.row, props.params?.column.field!!)
);
</script>
