<template>
	<InputNumber class="w-full" v-model:value="value"> </InputNumber>
</template>

<script lang="ts" setup>
import { InputNumber } from 'ant-design-vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['change']);

defineOptions({
	name: 'NumberSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: Number,
	defaultValue: Number,
});

const value = ref<number | undefined>(props.value);

watch(
	() => value.value,
	() => {
		emit('change', value.value);
	}
);
</script>
