<template>
	<Switch
		:disabled="disabled"
		v-model:checked="checked"
		@change="(v) => emit('change', v)"
	>
	</Switch>
</template>

<script lang="ts" setup>
import { Switch } from 'ant-design-vue';
import { ref } from 'vue';

defineOptions({
	name: 'BoolSetter',
	inheritAttrs: false,
});
const props = defineProps({
	value: Boolean,
	defaultValue: Boolean,
	disabled: Boolean,
});

const emit = defineEmits(['change']);

const checked = ref(props.value);

if (checked.value === undefined || checked.value === null) {
	checked.value = props.defaultValue;
}
</script>
