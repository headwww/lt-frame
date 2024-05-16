<template>
	<Select
		:mode="mode"
		:options="options"
		class="w-full ml-12px"
		v-model:value="check"
	></Select>
</template>

<script lang="ts" setup>
import { someType } from '@lt-frame/utils';
import { Select, SelectProps } from 'ant-design-vue';
import { SelectValue } from 'ant-design-vue/es/select';
import { PropType, ref, watch } from 'vue';

defineOptions({
	name: 'SelectSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: someType<SelectValue>([Array, Object, String, Number]),
	mode: {
		type: String as PropType<
			'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'
		>,
		default: '',
	},
	options: {
		type: Array as PropType<SelectProps['options']>,
	},
});
const emit = defineEmits(['change']);

const check = ref<any>(props.value);

watch(
	() => check.value,
	() => {
		emit('change', check.value);
	},
	{
		immediate: true,
	}
);
</script>
