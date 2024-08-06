<template>
	<InputGroup compact>
		<Select v-model:value="type" style="width: 25%">
			<SelectOption value="date-time">DateTime</SelectOption>
			<SelectOption value="date">Date</SelectOption>
			<SelectOption value="time">Time</SelectOption>
			<SelectOption value="week">周</SelectOption>
			<SelectOption value="month">月</SelectOption>
			<SelectOption value="quarter">季度</SelectOption>
			<SelectOption value="year">年</SelectOption>
		</Select>
		<DatePicker
			v-model:value="v1"
			:show-time="type === 'date-time'"
			:picker="type === 'date-time' ? 'date' : type"
			style="width: 75%"
		></DatePicker>
	</InputGroup>
</template>

<script lang="ts" setup>
import { DatePicker, InputGroup, Select, SelectOption } from 'ant-design-vue';
import { PropType, ref, watch } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const props = defineProps({
	value: {
		type: Object as PropType<Date>,
	},
});

const emit = defineEmits(['update:value']);

const type = ref<any>('date-time');

const v1 = ref<Dayjs | undefined>(props.value ? dayjs(props.value) : undefined);

watch(
	() => v1.value,
	() => {
		emit('update:value', v1.value?.toDate());
	}
);
</script>
