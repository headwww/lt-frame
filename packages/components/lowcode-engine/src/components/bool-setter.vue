<template>
	<Switch
		:disabled="disabled"
		v-model:checked="value"
		@change="(v) => emit('change', v)"
	>
	</Switch>
</template>

<script lang="ts" setup>
import { Switch } from 'ant-design-vue';

defineOptions({
	name: 'BoolSetter',
	inheritAttrs: false,
});
defineProps({
	disabled: Boolean,
});

const emit = defineEmits(['change']);

const value = defineModel('value', { type: Boolean });
</script>
