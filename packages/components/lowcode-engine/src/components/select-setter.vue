<template>
	<Select
		:defaultValue="defaultValue"
		:mode="mode"
		:options="options"
		class="w-full"
		v-model:value="value"
		@change="(v) => emit('change', v)"
	></Select>
</template>

<script lang="ts" setup>
import { Select, SelectProps } from 'ant-design-vue';
import { SelectValue } from 'ant-design-vue/es/select';
import { PropType } from 'vue';

defineOptions({
	name: 'SelectSetter',
	inheritAttrs: false,
});

defineProps({
	mode: {
		type: String as PropType<
			'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE'
		>,
		default: '',
	},
	options: {
		type: Array as PropType<SelectProps['options']>,
	},
	defaultValue: Object as PropType<SelectValue>,
});

const emit = defineEmits(['change']);

const value = defineModel('value', { type: [Array, Object, String, Number] });
</script>
