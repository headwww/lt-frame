<template>
	<a-select
		@change="change"
		style="width: 100%"
		v-bind="attrs"
		:value="getValue"
	>
	</a-select>
</template>

<script lang="ts" setup>
import type { VxeGlobalRendererHandles } from 'vxe-table';
import { get, set } from 'lodash-es';
import { type PropType, computed } from 'vue';
import { Select as ASelect } from 'ant-design-vue';
import { useAttrs } from '@lt-frame/hooks';

defineOptions({
	name: 'LTEditSelect',
	inheritAttrs: false,
});

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const attrs = useAttrs({ excludeKeys: ['onChange'] });

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
