<template>
	<Switch :disabled="disabled" v-model:checked="checked"> </Switch>
</template>

<script lang="ts" setup>
import { Switch } from 'ant-design-vue';
import { ref, watch } from 'vue';

const emit = defineEmits(['change']);

defineOptions({
	name: 'BoolSetter',
	inheritAttrs: false,
});

const props = defineProps({
	value: Boolean,
	disabled: Boolean,
});

const checked = ref<boolean>(props.value);

watch(
	() => checked.value,
	() => {
		emit('change', checked.value);
	},
	{
		immediate: true,
	}
);
</script>
