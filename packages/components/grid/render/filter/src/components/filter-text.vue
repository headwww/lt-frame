<template>
	<div style="padding: 8px; font-size: 15px">
		<a-alert
			type="info"
			message="提示：条件一为必选项、条件二为辅助筛选"
			banner
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select v-model:value="config.firstQueryCondition" style="width: 30%">
				<a-select-option
					v-for="item in ComparisonOperator"
					:key="item"
					:value="item"
					>{{ item == ComparisonOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-input
				placeholder="请输入条件一"
				v-model:value="config.firstQueryText"
				style="width: 70%"
			/>
		</a-input-group>
		<a-radio-group
			style="margin-top: 12px"
			v-model:value="config.logicalOperators"
			:options="plainOptions"
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select v-model:value="config.secondQueryCondition" style="width: 30%">
				<a-select-option
					v-for="item in ComparisonOperator"
					:key="item"
					:value="item"
					>{{ item == ComparisonOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-input
				placeholder="请输入条件二"
				v-model:value="config.secondQueryText"
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
	FilterConfig,
	ComparisonOperator,
} from '../advanced-filter';

const plainOptions = [LogicalOperators.AND, LogicalOperators.OR];

const props = defineProps({
	config: {
		type: Object as PropType<FilterConfig>,
		default: () => ({
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		}),
	},
});

const config = reactive<FilterConfig>({
	logicalOperators: props.config.logicalOperators,
	firstQueryCondition: props.config.firstQueryCondition,
	firstQueryText: props.config.firstQueryText,
	secondQueryCondition: props.config.secondQueryCondition,
	secondQueryText: props.config.secondQueryText,
});

function getConfig() {
	return config;
}

defineExpose({ getConfig });
</script>
