<template>
	<div :class="ns.b()">
		<a-segmented
			v-model:value="currentFilterMode"
			:options="filterModes"
			:class="ns.e('header')"
			:block="true"
		/>
		<div :class="ns.e('content')">
			<template v-if="getFilterModes.includes(FilterMode.TEXT)">
				<FilterText
					v-show="currentFilterMode == FilterMode.TEXT"
					:attrs="attrs.textAttrs"
					:config="getTextFilterConfig"
					ref="refFilterText"
				></FilterText>
			</template>

			<template v-if="getFilterModes.includes(FilterMode.NUMBER)">
				<FilterNumber
					v-show="currentFilterMode == FilterMode.NUMBER"
					:config="getNumberFilterConfig"
					:attrs="attrs.numberAttrs"
					ref="refFilterNumber"
				></FilterNumber>
			</template>

			<template v-if="getFilterModes.includes(FilterMode.DATE)">
				<FilterDate
					v-show="currentFilterMode == FilterMode.DATE"
					:config="getDateFilterConfig"
					:attrs="attrs.dateAttrs"
					ref="refFilterDate"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.CONTENT)">
				<FilterContent
					v-show="currentFilterMode == FilterMode.CONTENT"
					:attrs="attrs.contentAttrs"
					:config="getContentFilterConfig"
					:tree-data="getCheckedKeys"
					ref="refFilterContent"
				/>
			</template>
			<template v-if="getFilterModes.includes(FilterMode.ENTITY)">
				<FilterEntity
					:attrs="attrs"
					:entity-config="entityConfig"
					v-show="currentFilterMode == FilterMode.ENTITY"
					ref="refFilterEntity"
				/>
			</template>
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
import { computed, ref } from 'vue';
import { Segmented as ASegmented, Button as AButton } from 'ant-design-vue';
import { useAttrs, useNamespace } from '@lt-frame/hooks';
import { isUndefined } from 'lodash-es';
import FilterText from './components/filter-text.vue';
import FilterNumber from './components/filter-number.vue';
import FilterContent from './components/filter-content.vue';
import FilterDate from './components/filter-date.vue';
import FilterEntity from './components/filter-entity.vue';
import {
	ComparisonOperator,
	FilterComponentInstance,
	FilterContentInstance,
	FilterEntityInstance,
	FilterMode,
	TemporalOperator,
} from './types';
import { filterDeepProps } from './filter-deep';
import { useConfigFilter } from './use-config-filter';
import { useResetFilter } from './use-reset-filter';

defineOptions({
	name: 'LTDeepFilter',
	inheritAttrs: false,
});

const attrs = useAttrs();

const ns = useNamespace('filter-deep');

const props = defineProps(filterDeepProps);

const refFilterText = ref<FilterComponentInstance>();
const refFilterNumber = ref<FilterComponentInstance>();
const refFilterDate = ref<FilterComponentInstance>();
const refFilterContent = ref<FilterContentInstance>();
const refFilterEntity = ref<FilterEntityInstance>();

const {
	currentFilterMode,
	getCheckedKeys,
	getTextFilterConfig,
	getContentFilterConfig,
	getNumberFilterConfig,
	getDateFilterConfig,
} = useConfigFilter(props.params!!);

/** 加载筛选方式，如果没有设置值则默认开启['文本筛选', '分类筛选'] */
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
		return isUndefined(refFilterEntity.value?.getConfig());
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
</script>
