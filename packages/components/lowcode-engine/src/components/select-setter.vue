<template>
	<Select
		:defaultValue="defaultValue"
		:mode="mode"
		:options="options"
		class="w-full"
		v-model:value="selectValue"
		@change="(v) => emit('change', v)"
	></Select>
</template>

<script lang="ts" setup>
import { Select, SelectProps } from 'ant-design-vue';
import { SelectValue } from 'ant-design-vue/es/select';
import { PropType, ref, watch } from 'vue';

defineOptions({
	name: 'SelectSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: [Array, Object, String, Number],
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

const selectValue = ref<SelectValue>(props.value as SelectValue);

watch(
	() => props.value,
	() => {
		selectValue.value = props.value as SelectValue;
	}
);
</script>
