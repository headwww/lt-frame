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

defineProps({
	options: {
		type: Array as PropType<RadioGroupProps['options']>,
	},
});

const emit = defineEmits(['change']);

const value = defineModel('value', { type: [Array, Object, String, Number] });
</script>
