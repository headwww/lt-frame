import { VxeGlobalRendererHandles } from 'vxe-table';
import { computed, ref } from 'vue';
import { cloneDeep, get, set, uniqBy } from 'lodash-es';
import { ComparisonOperator, LogicalOperators } from './advanced-filter';

export function useConfigFilter(
	params: VxeGlobalRendererHandles.RenderFilterParams
) {
	/** 设置筛选模式，默认是文本筛选 */
	const currentFilterMode = ref(
		params.column.filters.length !== 0 &&
			params.column.filters[0].data &&
			params.column.filters[0].data.currentFilterMode
			? params.column.filters[0].data.currentFilterMode
			: ''
	);

	/** 设置文本筛选的筛选值 */
	const getTextFilterConfig = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { textFilterConfig } = data;
				if (textFilterConfig) {
					return textFilterConfig;
				}
			}
		}
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		};
	});

	/** 设置数字筛选的筛选值 */
	const getNumberFilterConfig = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { numberFilterConfig } = data;
				if (numberFilterConfig) {
					return numberFilterConfig;
				}
			}
		}
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		};
	});

	/** 设置日期筛选的筛选值 */
	const getDateFilterConfig = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { dateFilterConfig } = data;
				if (dateFilterConfig) {
					return dateFilterConfig;
				}
			}
		}
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		};
	});

	/** 设置内容筛选的筛选值 */
	const getContentFilterConfig = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { contentFilterConfig } = data;
				if (contentFilterConfig) {
					return contentFilterConfig;
				}
			}
		}
		return {
			checkedKeys: ['$_SELECT_ALL'],
		};
	});

	/** 设置内容筛选器的可筛选内容 */
	const getCheckedKeys = computed(() => {
		const arr: Array<any> = [];
		const { $table, column } = params;
		// 整个table的数据fullData，列表中展示的数据visibleData,已经加载的数据tableData
		const { fullData } = $table.getTableData();
		// 当前筛选的列的field和格式器
		const { field, formatter } = column;
		// 格式化后的表格数据
		const fullDataFormatter = cloneDeep(fullData);
		fullDataFormatter.forEach((item) => {
			if (typeof formatter === 'function') {
				set(
					item,
					field,
					formatter({ cellValue: get(item, field), row: item, column })
				);
			}
		});
		const uniqByArr = uniqBy(fullDataFormatter, field);
		uniqByArr.forEach((item) => {
			arr.push({
				title: get(item, params.column.field),
				key: get(item, params?.column.field),
			});
		});
		const arr1 = arr.filter((item) => item.title !== undefined);
		const arr2 = arr1.filter((item) => item.title !== '');
		return arr2;
	});

	return {
		getTextFilterConfig,
		currentFilterMode,
		getContentFilterConfig,
		getCheckedKeys,
		getNumberFilterConfig,
		getDateFilterConfig,
	};
}
