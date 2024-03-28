<template>
	<div
		style="width: 400px; height: 340px; display: flex; flex-direction: column"
	>
		<a-segmented
			v-model:value="currentFilterMode"
			:options="filterModes"
			style="margin: 8px 8px 4px"
			:block="true"
		/>

		<div style="flex: 1">
			<template v-if="getFilterModes.includes(FilterMode.TEXT)">
				<FilterText
					v-show="currentFilterMode == FilterMode.TEXT"
					:config="getTextFilterConfig"
					ref="refFilterText"
				></FilterText>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.NUMBER)">
				<FilterNumber
					v-show="currentFilterMode == FilterMode.NUMBER"
					:config="getNumberFilterConfig"
					ref="refFilterNumber"
				></FilterNumber>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.DATE)">
				<FilterDate
					v-show="currentFilterMode == FilterMode.DATE"
					:date-picker="datePickerProps"
					:config="getDateFilterConfig"
					ref="refFilterDate"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.CONTENT)">
				<FilterContent
					v-show="currentFilterMode == FilterMode.CONTENT"
					:config="getContentFilterConfig"
					:tree-data="getCheckedKeys"
					ref="refFilterContent"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.ENTITY)">
				<FilterEntity
					v-show="currentFilterMode == FilterMode.ENTITY"
					:grid-configs="gridConfigs"
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
import { useConfigFilter } from './use-config-filter';
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
			currentFilterMode,
			getCheckedKeys,
			getTextFilterConfig,
			getNumberFilterConfig,
			getContentFilterConfig,
			getDateFilterConfig,
		} = useConfigFilter(props.params!!);

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
			if (currentFilterMode.value === FilterMode.ENTITY) {
				return refFilterEntity.value?.getConfig().records.length === 0;
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

				data.entityFilterConfig =
					data.currentFilterMode === FilterMode.ENTITY
						? refFilterEntity.value?.getConfig()
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
			currentFilterMode,
			getCheckedKeys,
			getTextFilterConfig,
			getNumberFilterConfig,
			getContentFilterConfig,
			getDateFilterConfig,
			FilterMode,
		};
	},
});
</script>
