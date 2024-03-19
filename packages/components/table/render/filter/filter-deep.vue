<template>
	<div :class="ns.b()">
		<a-segmented
			v-model:value="currentFilterMode"
			:options="filterModes"
			:class="ns.e('header')"
			:block="true"
		/>
		<div :class="ns.e('content')">
			<FilterText
				:attrs="params?.column.filterRender.attrs"
				v-if="filterModes.includes(FilterMode.TEXT)"
				v-show="currentFilterMode == FilterMode.TEXT"
				:config="params?.column.filters[0].data.textFilterConfig"
				ref="refFilterText"
			></FilterText>
			<FilterNumber
				:attrs="params?.column.filterRender.attrs"
				v-if="filterModes.includes(FilterMode.NUMBER)"
				v-show="currentFilterMode == FilterMode.NUMBER"
				:config="params?.column.filters[0].data.numberFilterConfig"
				ref="refFilterNumber"
			></FilterNumber>
			<FilterDate
				:attrs="params?.column.filterRender.attrs"
				v-if="filterModes.includes(FilterMode.DATE)"
				v-show="currentFilterMode == FilterMode.DATE"
				:config="params?.column.filters[0].data.dateFilterConfig"
				ref="refFilterDate"
			/>
			<FilterContent
				:attrs="params?.column.filterRender.attrs"
				v-if="filterModes.includes(FilterMode.CONTENT)"
				v-show="currentFilterMode == FilterMode.CONTENT"
				:treeData="
					params?.column.filters[0].data.contentFilterConfig.treeData.length ===
					0
						? getTreeData
						: params?.column.filters[0].data.contentFilterConfig.treeData
				"
				:checked-keys="
					params?.column.filters[0].data.contentFilterConfig.checkedKeys
				"
				ref="refFilterContent"
			/>
			<FilterEntity
				:event="params?.column.filterRender.events"
				:attrs="params?.column.filterRender.attrs"
				:config="params?.column.filters[0].data.entityFilterConfig"
				v-if="filterModes.includes(FilterMode.ENTITY)"
				v-show="currentFilterMode == FilterMode.ENTITY"
			/>
		</div>
		<div :class="ns.e('fotter')">
			<a-button style="margin-right: 8px" @click="resetFilterEvent"
				>重置</a-button
			>
			<a-button
				v-model:disabled="getDisabled"
				type="primary"
				@click="confirmFilterEvent"
				>筛选</a-button
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { Segmented as ASegmented, Button as AButton } from 'ant-design-vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
import { isFunction, isUnDef } from '@lt-frame/utils';
import { useNamespace } from '@lt-frame/hooks';
import { cloneDeep, get, set, uniqBy } from 'lodash-es';
import FilterText from './components/filter-text.vue';
import FilterNumber from './components/filter-number.vue';
import FilterContent from './components/filter-content.vue';
import FilterDate from './components/filter-date.vue';
import FilterEntity from './components/filter-entity.vue';
import {
	ComparisonOperator,
	FilterComponentInstance,
	FilterContentInstance,
	FilterMode,
	TemporalOperator,
} from './types';
import { useResetFilter } from './use-reset-filter';

const ns = useNamespace('filter-deep');

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderFilterParams>,
});

const refFilterText = ref<FilterComponentInstance>();
const refFilterNumber = ref<FilterComponentInstance>();
const refFilterDate = ref<FilterComponentInstance>();
const refFilterContent = ref<FilterContentInstance>();

/** 加载筛选方式，如果没有设置值则默认开启['文本筛选', '分类筛选'] */
const filterModes = computed(() => {
	const { params } = props;
	if (params && params.column.filters[0].data.filterModes) {
		return params.column.filters[0].data.filterModes;
	}
	return [FilterMode.TEXT, FilterMode.CONTENT];
});

/** 设置筛选模式，默认是文本筛选 */
const currentFilterMode = ref(
	props.params &&
		!isUnDef(props.params.column.filters[0].data.currentFilterMode)
		? props.params.column.filters[0].data.currentFilterMode
		: FilterMode.TEXT
);

/** 构建一下treeData的数据 */
const getTreeData = computed(() => {
	const arr: Array<any> = [];
	const { params } = props;
	if (params) {
		const { data } = params.column.filters[0];
		// 外部设置了treeData则使用外部设置的
		if (data.contentFilterConfig.treeData.length !== 0) {
			return data.contentFilterConfig.treeData;
		}
		const { $table, column } = params;
		// 整个table的数据fullData，列表中展示的数据visibleData,已经加载的数据tableData
		const { visibleData } = $table.getTableData();
		// 当前筛选的列的field和格式器
		const { field, formatter } = column;
		// 格式化后的表格数据
		const visibleDataFormatter = cloneDeep(visibleData);
		visibleDataFormatter.forEach((item) => {
			if (isFunction(formatter)) {
				set(
					item,
					field,
					formatter({ cellValue: get(item, field), row: item, column })
				);
			}
		});
		// 去重格式化后的数据
		const uniqByArr = uniqBy(visibleDataFormatter, field);
		uniqByArr.forEach((item) => {
			arr.push({
				title: get(item, params.column.field),
				key: get(item, params?.column.field),
			});
		});
	}
	const arr1 = arr.filter((item) => item.title !== undefined);
	const arr2 = arr1.filter((item) => item.title !== '');
	return arr2;
});

/** 控制筛选按钮状态 */
const getDisabled = computed(() => {
	if (currentFilterMode.value === FilterMode.TEXT) {
		return (
			refFilterText.value?.getConfig().firstQueryCondition ===
			ComparisonOperator.EMPTY
		);
	}
	if (currentFilterMode.value === FilterMode.NUMBER) {
		return (
			refFilterNumber.value?.getConfig().firstQueryCondition ===
			ComparisonOperator.EMPTY
		);
	}
	if (currentFilterMode.value === FilterMode.DATE) {
		return (
			refFilterDate.value?.getConfig().firstQueryCondition ===
			TemporalOperator.EMPTY
		);
	}
	if (currentFilterMode.value === FilterMode.CONTENT) {
		return refFilterContent.value?.getConfig().checkedKeys.length === 0;
	}
	return true;
});

/** 重置 */
const resetFilterEvent = () => {
	const { params } = props;
	if (params) {
		const { $panel } = params;
		$panel.resetFilter();
	}
};

const {
	resetTextFilter,
	resetNumberFilter,
	resetDateFilter,
	resetContentFilter,
} = useResetFilter();

/** 筛选 */
const confirmFilterEvent = () => {
	const { params } = props;
	if (params) {
		const { data } = params.column.filters[0];

		data.currentFilterMode = currentFilterMode.value;

		data.textFilterConfig =
			data.currentFilterMode === FilterMode.TEXT
				? refFilterText.value?.getConfig()
				: resetTextFilter();

		data.numberFilterConfig =
			data.currentFilterMode === FilterMode.NUMBER
				? refFilterNumber.value?.getConfig()
				: resetNumberFilter();

		data.dateFilterConfig =
			data.currentFilterMode === FilterMode.DATE
				? refFilterDate.value?.getConfig()
				: resetDateFilter();

		data.contentFilterConfig =
			data.currentFilterMode === FilterMode.CONTENT
				? refFilterContent.value?.getConfig()
				: resetContentFilter();
		const { $panel } = params;
		$panel.changeOption(null, true, params.column.filters[0]);
		$panel.confirmFilter();
	}
};
</script>
