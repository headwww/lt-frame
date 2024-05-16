<template>
	<RadioGroup
		v-model:value="value"
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
	options: {
		type: Array as PropType<RadioGroupProps['options']>,
	},
	value: [Array, Object, String, Number],
});

const value = ref<any>(props.value);

const emit = defineEmits(['change']);

watch(
	() => value.value,
	() => {
		emit('change', value.value);
	},
	{
		immediate: true,
	}
);
</script>
