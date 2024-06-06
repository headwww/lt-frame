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
const props = defineProps({
	defaultValue: Boolean,
	disabled: Boolean,
});

const emit = defineEmits(['change']);

const value = defineModel('value', {
	type: Boolean,
});

if (value.value === undefined || value.value === null) {
	value.value = props.defaultValue;
}
</script>
