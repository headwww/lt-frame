<template>
	{{ value }}
</template>

<script lang="ts" setup>
defineOptions({
	name: 'TextSetter',
	inheritAttrs: false,
});

defineProps({
	defaultValue: String,
	placeholder: String,
});

const value = defineModel('value', {
	type: String,
});
</script>
