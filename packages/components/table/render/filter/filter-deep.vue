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
				v-if="filterModes.includes(FilterMode.TEXT)"
				v-show="currentFilterMode == FilterMode.TEXT"
				:config="params?.column.filters[0].data.textFilterConfig"
			></FilterText>
			<FilterNumber
				v-if="filterModes.includes(FilterMode.NUMBER)"
				v-show="currentFilterMode == FilterMode.NUMBER"
				:config="params?.column.filters[0].data.numberFilterConfig"
			></FilterNumber>
		</div>
		<div :class="ns.e('fotter')"></div>
	</div>
</template>

<script lang="ts" setup>
import { PropType, computed, ref } from 'vue';
import { Segmented as ASegmented } from 'ant-design-vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
import { isUnDef } from '@lt-frame/utils';
import { useNamespace } from '@lt-frame/hooks';
import FilterText from './components/filter-text.vue';
import FilterNumber from './components/filter-number.vue';
import { FilterMode } from './types';

const ns = useNamespace('filter-deep');

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderFilterParams>,
});

/**
 * 加载筛选方式，如果没有设置值则默认开启['文本筛选', '分类筛选']
 */
const filterModes = computed(() => {
	const { params } = props;
	if (params && params.column.filters[0].data.filterModes) {
		return params.column.filters[0].data.filterModes;
	}
	return [FilterMode.TEXT, FilterMode.CONTENT];
});

/**
 * 设置筛选模式，默认是文本筛选
 */
const currentFilterMode = ref(
	props.params &&
		!isUnDef(props.params.column.filters[0].data.currentFilterMode)
		? props.params.column.filters[0].data.currentFilterMode
		: FilterMode.TEXT
);
</script>
