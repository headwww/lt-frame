<template>
	<RadioGroup
		v-model:value="value"
		:options="options"
		option-type="button"
		@change="(v) => emit('change', v.target.value)"
	></RadioGroup>
</template>

<script lang="ts" setup>
import { RadioGroup, RadioGroupProps } from 'ant-design-vue';
import { PropType } from 'vue';

defineOptions({
	name: 'RadioGroupSetter',
	inheritAttrs: false,
});

const props = defineProps({
	options: {
		type: Array as PropType<RadioGroupProps['options']>,
	},
	defaultValue: [Array, Object, String, Number],
});

const emit = defineEmits(['change']);

const value = defineModel('value', {
	type: [Array, Object, String, Number],
});

if (value.value === undefined || value.value === null || value.value === '') {
	value.value = props.defaultValue;
}
</script>
