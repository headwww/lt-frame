<template>
	<Input
		:defaultValue="defaultValue"
		v-model:value="input"
		:placeholder="placeholder"
	>
	</Input>
</template>

<script lang="ts" setup>
import { Input } from 'ant-design-vue';
import { ref, watch } from 'vue';

defineOptions({
	name: 'StringSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: String,
	defaultValue: String,
	placeholder: String,
});

const emit = defineEmits(['change']);

const input = ref(props.value);

watch(
	() => input.value,
	() => {
		emit('change', input.value);
	}
);
</script>
