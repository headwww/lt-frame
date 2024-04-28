import { VXETable, VxeGlobalRendererHandles } from 'vxe-table';
import { computed, ref } from 'vue';
import { cloneDeep, get, isArray, isFunction, set, uniqBy } from 'lodash-es';
import XEUtils from 'xe-utils';
import { ComparisonOperator, LogicalOperators } from './advanced-filter';

export function useFilterData(
	params: VxeGlobalRendererHandles.RenderFilterParams
) {
	/** 设置筛选模式，默认是文本筛选 */
	const currentMode = ref(
		params.column.filters.length !== 0 &&
			params.column.filters[0].data &&
			params.column.filters[0].data.currentMode
			? params.column.filters[0].data.currentMode
			: ''
	);

	/** 设置文本筛选的筛选值 */
	const getTextFilterData = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { textFilterData } = data;
				if (textFilterData) {
					return textFilterData;
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
	const getNumberFilterData = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { numberFilterData } = data;
				if (numberFilterData) {
					return numberFilterData;
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
	const getDateFilterData = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { dateFilterData } = data;
				if (dateFilterData) {
					return dateFilterData;
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
	const getContentFilterData = computed(() => {
		const { filters } = params.column;
		if (filters && filters.length !== 0) {
			const { data } = filters[0];
			if (data) {
				const { contentFilterData } = data;
				if (contentFilterData) {
					return contentFilterData;
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
			if (formatter) {
				if (isFunction(formatter)) {
					set(
						item,
						field,
						formatter({ cellValue: get(item, field), row: item, column })
					);
				} else {
					if (isArray(formatter)) {
						if (formatter.length > 0) {
							const fm = VXETable.formats.get(formatter[0]).cellFormatMethod;
							if (isFunction(fm)) {
								set(
									item,
									field,
									fm(
										{ cellValue: get(item, field), row: item, column },
										...XEUtils.slice(formatter, 1)
									)
								);
							}
						}
					} else {
						const fm = VXETable.formats.get(formatter).cellFormatMethod;
						if (isFunction(fm)) {
							set(
								item,
								field,
								fm({ cellValue: get(item, field), row: item, column })
							);
						}
					}
				}
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
		getTextFilterData,
		currentMode,
		getContentFilterData,
		getCheckedKeys,
		getNumberFilterData,
		getDateFilterData,
	};
}
