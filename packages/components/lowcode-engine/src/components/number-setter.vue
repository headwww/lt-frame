<template>
	<InputNumber
		class="w-full"
		v-model:value="inputNumber"
		:placeholder="placeholder"
		:defaultValue="defaultValue"
		:max="max"
		:min="min"
	>
	</InputNumber>
</template>

<script lang="ts" setup>
import { InputNumber } from 'ant-design-vue';
import { ref, watch } from 'vue';

defineOptions({
	name: 'NumberSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: Number,
	defaultValue: Number,
	placeholder: String,
	max: Number,
	min: Number,
});

const emit = defineEmits(['change']);

const inputNumber = ref(props.value);

watch(
	() => props.value,
	() => {
		inputNumber.value = props.value;
	}
);

watch(
	() => inputNumber.value,
	() => {
		emit('change', inputNumber.value);
	}
);
</script>
