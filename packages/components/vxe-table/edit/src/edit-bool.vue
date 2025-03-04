<template>
	<Switch @change="change" :checked="getValue"> </Switch>
</template>

<script lang="ts" setup>
import { Switch } from 'ant-design-vue';
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { computed, type PropType } from 'vue';
import { get, set } from 'lodash-es';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderTableEditParams>,
});

const getValue = computed(() => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		return get(row, column.field);
	}
	return false;
});

const change = async (value: any) => {
	const { params } = props;
	if (params) {
		const { row, column } = params;
		set(row, column.field, value);
	}
};
</script>
