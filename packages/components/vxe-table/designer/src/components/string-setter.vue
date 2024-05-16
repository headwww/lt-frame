<template>
	<Input v-model:value="value"> </Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['change']);

defineOptions({
	name: 'StringSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: String,
	defaultValue: String,
});

const value = ref<string | undefined>(props.value);

watch(
	() => value.value,
	() => {
		emit('change', value.value);
	}
);
</script>
