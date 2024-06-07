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
	value: String,
	defaultValue: String,
	placeholder: String,
});
</script>
