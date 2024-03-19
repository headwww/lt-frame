import { VXETable } from 'vxe-table';
import { isFunction, isNullOrUnDef } from '@lt-frame/utils';
import FilterDeep from './filter-deep.vue';
import { DeepFilterConfig, FilterMode } from './types';
import { compareFilter } from './util';
import { useResetFilter } from './use-reset-filter';

VXETable.renderer.add('Filter-Deep', {
	showFilterFooter: false,
	renderFilter(_renderOpts, params) {
		return <FilterDeep key={params.column.field} params={params}></FilterDeep>;
	},
	filterResetMethod(params) {
		const {
			resetContentFilter,
			resetDateFilter,
			resetNumberFilter,
			resetTextFilter,
		} = useResetFilter();

		const { options } = params;

		options.forEach((option) => {
			option.data = {
				filterModes: [...option.data.filterModes],
				currentFilterMode: option.data.currentFilterMode,
				textFilterConfig: resetTextFilter(),
				numberFilterConfig: resetNumberFilter(),
				dateFilterConfig: resetDateFilter(),
				contentFilterConfig: resetContentFilter(),
			} as DeepFilterConfig;
		});
	},
	filterMethod(params) {
		const { column } = params;
		const { formatter } = column;
		// 原始值
		// const rawValue = params.cellValue;
		// 格式化单元格数据
		let cellValue = isFunction(formatter)
			? formatter({ cellValue: params.cellValue, row: null, column })
			: params.cellValue;
		const { data } = column.filters[0];
		if (data.currentFilterMode === FilterMode.TEXT) {
			return compareFilter(
				data.currentFilterMode,
				cellValue,
				data.textFilterConfig
			);
		}
		if (data.currentFilterMode === FilterMode.NUMBER) {
			return compareFilter(
				data.currentFilterMode,
				cellValue,
				data.numberFilterConfig
			);
		}
		if (data.currentFilterMode === FilterMode.DATE) {
			return compareFilter(
				data.currentFilterMode,
				cellValue,
				data.dateFilterConfig
			);
		}
		if (data.currentFilterMode === FilterMode.CONTENT) {
			const arr: Array<any> = data.contentFilterConfig.checkedKeys;
			if (arr.includes('$_SELECT_ALL')) {
				return true;
			}
			if (isNullOrUnDef(cellValue) || cellValue === '') {
				cellValue = '$_SELECT_NULL';
			}
			return arr.includes(cellValue);
		}

		return false;
	},
});
