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
				style="width: 30%"
			>
				<a-select-option
					v-for="item in ComparisonOperator"
					:key="item"
					:value="item"
					>{{ item == ComparisonOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-input
				placeholder="请输入条件一"
				v-model:value="filterData.firstQueryText"
				style="width: 70%"
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
				style="width: 30%"
			>
				<a-select-option
					v-for="item in ComparisonOperator"
					:key="item"
					:value="item"
					>{{ item == ComparisonOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-input
				placeholder="请输入条件二"
				v-model:value="filterData.secondQueryText"
				style="width: 70%"
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
	Input as AInput,
} from 'ant-design-vue';
import {
	LogicalOperators,
	FilterData,
	ComparisonOperator,
} from '../advanced-filter';

const plainOptions = [LogicalOperators.AND, LogicalOperators.OR];

const props = defineProps({
	filterData: {
		type: Object as PropType<FilterData>,
		default: () => ({
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
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
