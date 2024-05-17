<template>
	<InputNumber class="w-full" v-model:value="value"> </InputNumber>
</template>

<script lang="ts" setup>
import { InputNumber } from 'ant-design-vue';

defineOptions({
	name: 'NumberSetter',
	inheritAttrs: false,
});

defineProps({
	defaultValue: Number,
});

const emit = defineEmits(['change']);

const value = defineModel('value', {
	type: Number,
	set(v) {
		emit('change', v);
	},
});
</script>
