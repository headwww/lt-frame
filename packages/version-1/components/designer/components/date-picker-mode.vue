<template>
	<InputGroup compact>
		<Select v-model:value="selectType" style="width: 25%">
			<SelectOption value="date-time">DateTime</SelectOption>
			<SelectOption value="date">Date</SelectOption>
			<SelectOption value="time">Time</SelectOption>
			<!-- <SelectOption value="week">周</SelectOption>
			<SelectOption value="month">月</SelectOption>
			<SelectOption value="quarter">季度</SelectOption>
			<SelectOption value="year">年</SelectOption> -->
		</Select>
		<DatePicker
			v-model:value="v1"
			:show-time="selectType === 'date-time'"
			:picker="selectType === 'date-time' ? 'date' : selectType"
			style="width: 75%"
		></DatePicker>
	</InputGroup>
</template>

<script lang="ts" setup>
import { DatePicker, InputGroup, Select, SelectOption } from 'ant-design-vue';
import { ref, watch } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

const props = defineProps({
	value: {
		type: String,
	},
	type: String,
});

const emit = defineEmits(['update:value', 'update:type']);

const selectType = ref<any>(props.type ? props.type : 'date-time');

const v1 = ref<Dayjs | undefined>(props.value ? dayjs(props.value) : undefined);

watch(
	() => v1.value,
	() => {
		emit('update:value', v1.value?.toDate());
	}
);
watch(
	() => selectType.value,
	() => {
		emit('update:type', selectType.value);
	}
);
</script>
