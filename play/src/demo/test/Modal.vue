<template>
	<Modal v-model:open="mOpen"> </Modal>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue';
import { computed } from 'vue';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	open: Boolean,
});

const emit = defineEmits(['update:open']);

const mOpen = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value),
});
</script>
