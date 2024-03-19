<template>
	<div style="padding: 8px; font-size: 15px">
		<a-alert
			type="info"
			message="提示：条件一为必选项、条件二为辅助筛选"
			banner
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select v-model:value="config.firstQueryCondition" style="width: 38%">
				<a-select-option
					v-for="item in TemporalOperator"
					:key="item"
					:value="item"
					>{{ item == TemporalOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-date-picker
				v-bind:="props.attrs?.dateAttrs"
				v-model:value="config.firstQueryText"
				style="width: 62%"
				type="date"
			/>
		</a-input-group>
		<a-radio-group
			style="margin-top: 12px"
			v-model:value="config.logicalOperators"
			:options="plainOptions"
		/>
		<a-input-group style="margin-top: 12px" compact>
			<a-select v-model:value="config.secondQueryCondition" style="width: 38%">
				<a-select-option
					v-for="item in TemporalOperator"
					:key="item"
					:value="item"
					>{{ item == TemporalOperator.EMPTY ? '' : item }}</a-select-option
				>
			</a-select>
			<a-date-picker
				v-bind:="props.attrs?.dateAttrs"
				v-model:value="config.secondQueryText"
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
	FilterConfig,
	TemporalOperator,
	DeepFilterAttrs,
} from '../types';

const plainOptions = [LogicalOperators.AND, LogicalOperators.OR];

const props = defineProps({
	attrs: {
		type: Object as PropType<DeepFilterAttrs>,
	},
	config: {
		type: Object as PropType<FilterConfig>,
		default: () => ({
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: TemporalOperator.EQUALS,
			firstQueryText: '',
			secondQueryCondition: TemporalOperator.EMPTY,
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
