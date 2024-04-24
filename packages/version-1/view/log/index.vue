<template>
	<LtPageLayout title="错误日志" dense>
		<DetailModal :info="rowInfo" @register="registerModal" />

		<VxeGrid class="lt-table-scrollbar" v-bind="gridOptions">
			<template #type="{ row }">
				<Tag :color="getColor(row.type)">{{ row.type }}</Tag>
			</template>
		</VxeGrid>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import {
	ComparisonOperator,
	FilterMode,
	LogicalOperators,
	LtPageLayout,
	TemporalOperator,
	useModal,
} from '@lt-frame/components';
import { VxeGridProps } from 'vxe-table';
import { nextTick, reactive, ref, watch } from 'vue';
import { cloneDeep } from 'lodash-es';
import { Tag } from 'ant-design-vue';
import { useErrorLogStore } from '../../stores';
import { ErrorLogInfo, ErrorTypeEnum } from '../../error';
import DetailModal from './DetailModal.vue';

const rowInfo = ref<ErrorLogInfo>();

const errorLogStore = useErrorLogStore();

const [registerModal, { openModal }] = useModal();

function getColor(text: ErrorTypeEnum) {
	const type =
		text === ErrorTypeEnum.VUE
			? 'green'
			: text === ErrorTypeEnum.RESOURCE
				? 'cyan'
				: text === ErrorTypeEnum.PROMISE
					? 'blue'
					: ErrorTypeEnum.AJAX
						? 'red'
						: 'purple';
	return type;
}

const gridOptions = reactive<VxeGridProps>({
	autoResize: true,
	height: 'auto',
	align: 'center',
	size: 'medium',
	data: [],
	columns: [
		{ type: 'seq', width: 40 },
		{
			width: 80,
			cellRender: {
				name: '$lt-cell-operate',
				props: {
					buttons: [
						{
							text: '详情',
							event: 'BTN1',
						},
					],
				},
				events: {
					onItemClick: (event, params) => {
						rowInfo.value = params.row;
						openModal(true);
					},
				},
			},
			fixed: 'right',
			align: 'center',
		},
		{
			field: 'type',
			title: '类型',
			width: '80',
			slots: {
				default: 'type',
			},
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.CONTENT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
				},
			},
		},
		{
			field: 'url',
			title: 'URL',
			width: '200',
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.TEXT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT],
				},
			},
		},
		{
			field: 'time',
			title: '时间',
			width: '200',
			filters: [
				{
					data: {
						currentMode: FilterMode.DATE,
						dateFilterData: {
							logicalOperators: LogicalOperators.AND,
							firstQueryCondition: TemporalOperator.EQUALS,
							firstQueryText: '',
							secondQueryCondition: TemporalOperator.EMPTY,
							secondQueryText: '',
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.DATE],
					datePickerProps: {
						showTime: true,
					},
				},
			},
		},
		{
			field: 'file',
			title: '文件',
			width: '200',
		},
		{
			field: 'name',
			title: 'Name',
			width: '200',
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.CONTENT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
						contentFilterConfig: {
							checkedKeys: ['$_SELECT_ALL'],
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT, FilterMode.CONTENT],
				},
			},
		},
		{
			field: 'message.message',
			title: '错误信息',
			width: '200',
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.CONTENT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT],
				},
			},
		},
		{
			field: 'stack',
			title: 'stack信息',
			filters: [
				{
					data: {
						// 选中的筛选方式
						currentMode: FilterMode.TEXT,
						// 数字筛选配置
						textFilterData: {
							// 两个条件之间的逻辑操作
							logicalOperators: LogicalOperators.AND,
							// 第一个查询条件
							firstQueryCondition: ComparisonOperator.INCLUDE,
							// 第一个查询文本
							firstQueryText: '',
							// 第二个查询条件
							secondQueryCondition: ComparisonOperator.EMPTY,
							// 第二个查询文本
							secondQueryText: '',
						},
					},
				},
			],
			filterRender: {
				name: '$lt-filter',
				props: {
					filterModes: [FilterMode.TEXT],
				},
			},
		},
	],
});

watch(
	() => errorLogStore.getErrorLogInfoList,
	(list) => {
		nextTick(() => {
			gridOptions.data = cloneDeep(list);
		});
	},
	{
		immediate: true,
	}
);
</script>
