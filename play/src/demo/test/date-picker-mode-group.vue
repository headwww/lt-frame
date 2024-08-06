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
		<RangePicker
			v-model:value="v1"
			:show-time="type === 'date-time'"
			:picker="type === 'date-time' ? 'date' : type"
			style="width: 75%"
		></RangePicker>
	</InputGroup>
</template>

<script lang="ts" setup>
import { RangePicker, InputGroup, Select, SelectOption } from 'ant-design-vue';
import { PropType, ref, watch } from 'vue';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { get } from 'lodash-es';

const props = defineProps({
	value: {
		type: Array as PropType<Array<Date>>,
	},
});

type RangeValue = [Dayjs, Dayjs];

const emit = defineEmits(['update:value']);

const type = ref<any>('date-time');

const v1 = ref<RangeValue>([
	dayjs(get(props.value, '0')),
	dayjs(get(props.value, '1')),
]);

watch(
	() => v1.value,
	() => {
		emit('update:value', [
			get(v1.value, '0')?.toDate(),
			get(v1.value, '1')?.toDate(),
		]);
	}
);
</script>
