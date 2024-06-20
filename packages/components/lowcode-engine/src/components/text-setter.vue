<template>
	<Tooltip :title="value">
		<span class="lt-text-setter">
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
