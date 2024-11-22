<template>
	<Popover trigger="click" placement="bottom">
		<button
			style="
				background-color: #4a9eff;
				color: white;
				border: none;
				border-radius: 4px;
				padding: 0 15px;
				margin: 0 2px;
				cursor: pointer;
				font-size: 14px;
				line-height: 20px;
			"
		>
			{{ value1 ? value1.format('YYYY-MM-DD HH:mm:ss') : '?' }}
		</button>

		<template #content>
			<div>
				<DatePicker v-model:value="value1" showTime placeholder="请选择日期" />
			</div>
		</template>
	</Popover>
</template>
<script setup lang="ts">
import { Popover, DatePicker } from 'ant-design-vue';
import { computed } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const props = defineProps({
	value: Number,
});

const emit = defineEmits(['update:value']);

const value1 = computed({
	get: () => (props.value ? dayjs(props.value) : undefined),
	set: (value: Dayjs | undefined) => {
		emit('update:value', value?.valueOf());
	},
});
</script>
