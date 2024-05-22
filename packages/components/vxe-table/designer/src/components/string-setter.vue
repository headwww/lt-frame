<template>
	<Input v-model:value="value" :placeholder="placeholder"> </Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';

defineOptions({
	name: 'StringSetter',
	inheritAttrs: false,
});

defineProps({
	defaultValue: String,
	placeholder: String,
});

const emit = defineEmits(['change']);

const value = defineModel('value', {
	type: String,
	set(v) {
		emit('change', v);
	},
});
</script>
