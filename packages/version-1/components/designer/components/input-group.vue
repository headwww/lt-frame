<template>
	<InputGroup compact>
		<Input v-model:value="v1" style="width: 50%" />
		<Input v-model:value="v2" style="width: 50%" />
	</InputGroup>
</template>

<script lang="ts" setup>
import { InputGroup, Input } from 'ant-design-vue';
import { get } from 'lodash-es';
import { PropType, ref, watchEffect } from 'vue';

const props = defineProps({
	value: {
		type: Array as PropType<Array<string>>,
		default: () => ['', ''],
	},
});

const emit = defineEmits(['update:value']);

const v1 = ref(get(props.value, '0'));
const v2 = ref(get(props.value, '1'));

watchEffect(() => {
	emit('update:value', [v1.value, v2.value]);
});
</script>
