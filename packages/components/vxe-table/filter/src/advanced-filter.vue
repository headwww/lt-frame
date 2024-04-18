<template>
	<div
		style="width: 400px; height: 340px; display: flex; flex-direction: column"
	>
		<a-segmented
			v-model:value="currentMode"
			:options="filterModes"
			style="margin: 8px 8px 4px"
			:block="true"
		/>

		<div style="flex: 1">
			<template v-if="getFilterModes.includes(FilterMode.TEXT)">
				<FilterText
					v-show="currentMode == FilterMode.TEXT"
					:filterData="getTextFilterData"
					ref="refFilterText"
				></FilterText>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.NUMBER)">
				<FilterNumber
					v-show="currentMode == FilterMode.NUMBER"
					:filterData="getNumberFilterData"
					ref="refFilterNumber"
				></FilterNumber>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.DATE)">
				<FilterDate
					v-show="currentMode == FilterMode.DATE"
					:date-picker="datePickerProps"
					:filterData="getDateFilterData"
					ref="refFilterDate"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.CONTENT)">
				<FilterContent
					v-show="currentMode == FilterMode.CONTENT"
					:filterData="getContentFilterData"
					:tree-data="getCheckedKeys"
					ref="refFilterContent"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.ENTITY)">
				<FilterEntity
					v-show="currentMode == FilterMode.ENTITY"
					:configs="configs"
					:ajax="ajax"
					ref="refFilterEntity"
				/>
			</template>
		</div>

		<div style="text-align: right; padding: 10px 10px 10px 0">
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

<script lang="ts">
import { Segmented as ASegmented, Button as AButton } from 'ant-design-vue';
import { computed, defineComponent, ref } from 'vue';
import {
	ComparisonOperator,
	FilterMode,
	TemporalOperator,
	advanceFilterProps,
} from './advanced-filter';
import { useFilterData } from './use-filter-data';
import { useResetFilter } from './use-reset-filter';
import FilterText from './components/filter-text.vue';
import FilterNumber from './components/filter-number.vue';
import FilterContent from './components/filter-content.vue';
import FilterDate from './components/filter-date.vue';
import FilterEntity from './components/filter-entity.vue';

export default defineComponent({
	props: advanceFilterProps,
	components: {
		ASegmented,
		AButton,
		FilterText,
		FilterNumber,
		FilterContent,
		FilterDate,
		FilterEntity,
	},
	setup(props) {
		const refFilterText = ref();
		const refFilterNumber = ref();
		const refFilterDate = ref();
		const refFilterContent = ref();
		const refFilterEntity = ref();

		const {
			currentMode,
			getCheckedKeys,
			getTextFilterData,
			getNumberFilterData,
			getContentFilterData,
			getDateFilterData,
		} = useFilterData(props.params!!);

		/** 选中的筛选模式 */
		const getFilterModes = computed(() => {
			const { filterModes } = props;
			if (filterModes) {
				return filterModes;
			}
			return [FilterMode.TEXT, FilterMode.CONTENT];
		});

		/** 重置 */
		const resetFilterEvent = () => {
			const { params } = props;
			if (params) {
				const { $panel } = params;
				$panel.resetFilter();
			}
		};

		/** 控制筛选按钮状态 */
		const getDisabled = computed(() => {
			if (currentMode.value === FilterMode.TEXT) {
				return (
					refFilterText.value?.getFilterData().firstQueryCondition ===
					ComparisonOperator.EMPTY
				);
			}
			if (currentMode.value === FilterMode.NUMBER) {
				return (
					refFilterNumber.value?.getFilterData().firstQueryCondition ===
					ComparisonOperator.EMPTY
				);
			}
			if (currentMode.value === FilterMode.DATE) {
				return (
					refFilterDate.value?.getFilterData().firstQueryCondition ===
					TemporalOperator.EMPTY
				);
			}
			if (currentMode.value === FilterMode.CONTENT) {
				return refFilterContent.value?.getFilterData().checkedKeys.length === 0;
			}
			if (currentMode.value === FilterMode.ENTITY) {
				return refFilterEntity.value?.getFilterData().records.length === 0;
			}
			return true;
		});

		const {
			resetContentFilter,
			resetDateFilter,
			resetNumberFilter,
			resetTextFilter,
			resetEntityFilter,
		} = useResetFilter();

		/** 筛选事件 */
		const confirmFilterEvent = () => {
			const { params } = props;
			if (params) {
				const { data } = params.column.filters[0];
				data.currentMode = currentMode.value;

				data.textFilterData =
					data.currentMode === FilterMode.TEXT
						? refFilterText.value?.getFilterData()
						: resetTextFilter();

				data.numberFilterData =
					data.currentMode === FilterMode.NUMBER
						? refFilterNumber.value?.getFilterData()
						: resetNumberFilter();

				data.dateFilterData =
					data.currentMode === FilterMode.DATE
						? refFilterDate.value?.getFilterData()
						: resetDateFilter();

				data.contentFilterData =
					data.currentMode === FilterMode.CONTENT
						? refFilterContent.value?.getFilterData()
						: resetContentFilter();

				data.entityFilterData =
					data.currentMode === FilterMode.ENTITY
						? refFilterEntity.value?.getFilterData()
						: resetEntityFilter();

				const { $panel } = params;
				$panel.changeOption(null, true, params.column.filters[0]);
				$panel.confirmFilter();
			}
		};

		return {
			confirmFilterEvent,
			getDisabled,
			resetFilterEvent,
			getFilterModes,
			currentMode,
			getCheckedKeys,
			getTextFilterData,
			getNumberFilterData,
			getContentFilterData,
			getDateFilterData,
			FilterMode,
			refFilterText,
			refFilterNumber,
			refFilterDate,
			refFilterContent,
			refFilterEntity,
		};
	},
});
</script>
