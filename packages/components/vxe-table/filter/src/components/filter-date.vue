<template>
	<div style="padding: 8px; font-size: 15px">
		<a-alert
			type="info"
			message="提示：条件一为必选项、条件二为辅助筛选"
			banner
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select
				v-model:value="filterData.firstQueryCondition"
				style="width: 38%"
			>
				<a-select-option
					v-for="item in TemporalOperator"
					:key="item"
					:value="item"
					>{{ item == TemporalOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-date-picker
				v-bind="datePicker"
				v-model:value="filterData.firstQueryText"
				style="width: 62%"
				type="date"
			/>
		</a-input-group>
		<a-radio-group
			style="margin-top: 12px"
			v-model:value="filterData.logicalOperators"
			:options="plainOptions"
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select
				v-model:value="filterData.secondQueryCondition"
				style="width: 38%"
			>
				<a-select-option
					v-for="item in TemporalOperator"
					:key="item"
					:value="item"
					>{{ item == TemporalOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-date-picker
				v-bind="datePicker"
				v-model:value="filterData.secondQueryText"
				style="width: 62%"
				type="date"
			/>
		</a-input-group>
	</div>
</template>

<script lang="ts" setup>
import { PropType, reactive } from 'vue';
import {
	Alert as AAlert,
	InputGroup as AInputGroup,
	Select as ASelect,
	SelectOption as ASelectOption,
	RadioGroup as ARadioGroup,
	DatePicker as ADatePicker,
} from 'ant-design-vue';
import {
	LogicalOperators,
	FilterData,
	TemporalOperator,
} from '../advanced-filter';

const plainOptions = [LogicalOperators.AND, LogicalOperators.OR];

const props = defineProps({
	datePicker: Object as PropType<any>,
	filterData: {
		type: Object as PropType<FilterData>,
		default: () => ({
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: TemporalOperator.EQUALS,
			firstQueryText: '',
			secondQueryCondition: TemporalOperator.EMPTY,
			secondQueryText: '',
		}),
	},
});

const filterData = reactive<FilterData>({
	logicalOperators: props.filterData.logicalOperators,
	firstQueryCondition: props.filterData.firstQueryCondition,
	firstQueryText: props.filterData.firstQueryText,
	secondQueryCondition: props.filterData.secondQueryCondition,
	secondQueryText: props.filterData.secondQueryText,
});

function getFilterData() {
	return filterData;
}

defineExpose({ getFilterData });
</script>
