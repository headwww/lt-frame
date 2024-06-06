<template>
	<Tooltip :title="value">
		<span class="w-full overflow-hidden whitespace-nowrap text-ellipsis">
			{{ value }}
		</span>
	</Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue';

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
