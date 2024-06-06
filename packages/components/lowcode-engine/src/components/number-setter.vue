<template>
	<InputNumber
		class="w-full"
		v-model:value="value"
		:placeholder="placeholder"
		:defaultValue="defaultValue"
		:max="max"
		:min="min"
	>
	</InputNumber>
</template>

<script lang="ts" setup>
import { InputNumber } from 'ant-design-vue';

defineOptions({
	name: 'NumberSetter',
	inheritAttrs: false,
});

defineProps({
	defaultValue: Number,
	placeholder: String,
	max: Number,
	min: Number,
});

const emit = defineEmits(['change']);

const value = defineModel('value', {
	type: Number,
	set(v) {
		emit('change', v);
	},
});
</script>
