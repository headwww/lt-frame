<template>
	<RadioGroup
		v-model:value="radioGroupValue"
		:options="options"
		option-type="button"
	></RadioGroup>
</template>

<script lang="ts" setup>
import { RadioGroup, RadioGroupProps } from 'ant-design-vue';
import { PropType, ref, watch } from 'vue';

defineOptions({
	name: 'RadioGroupSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: [Array, Object, String, Number],
	options: {
		type: Array as PropType<RadioGroupProps['options']>,
	},
	defaultValue: [Array, Object, String, Number],
});

const emit = defineEmits(['change']);

const radioGroupValue = ref(props.value);

watch(
	() => props.value,
	() => {
		radioGroupValue.value = props.value;
	}
);

watch(
	() => radioGroupValue.value,
	() => {
		emit('change', radioGroupValue.value);
	}
);

if (
	radioGroupValue.value === undefined ||
	radioGroupValue.value === null ||
	radioGroupValue.value === ''
) {
	radioGroupValue.value = props.defaultValue;
}
</script>
