import { VXETable } from 'vxe-table';
import { isFunction, isNullOrUnDef } from '@lt-frame/utils';
import { get, join, split } from 'lodash-es';
import AdvancedFilter from './src/advanced-filter.vue';
import { useResetFilter } from './src/use-reset-filter';
import { FilterMode } from './src/advanced-filter';
import { compareFilter } from './src/util';

VXETable.renderer.add('$advancedFilter', {
	showFilterFooter: false,
	renderFilter({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<AdvancedFilter
				key={params.column.field}
				{...props}
				{...attrs}
				{...events}
				params={params}
			></AdvancedFilter>
		);
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
				currentFilterMode: option.data.currentFilterMode,
				textFilterConfig: resetTextFilter(),
				numberFilterConfig: resetNumberFilter(),
				dateFilterConfig: resetDateFilter(),
				contentFilterConfig: resetContentFilter(),
			};
		});
	},
	filterMethod(params) {
		const { column } = params;
		const { formatter } = column;
		// 原始值
		const rawValue = params.cellValue;
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

		if (data.currentFilterMode === FilterMode.ENTITY) {
			const splitList = split(params.column.field, '.');
			if (splitList.length > 1) {
				splitList.shift();
				const otherKey = join(splitList, '.');
				const arr: string[] = [];
				if (data.entityFilterConfig.records.length > 0) {
					data.entityFilterConfig.records.forEach((item: any) => {
						arr.push(get(item, otherKey));
					});
				}
				return arr.includes(rawValue);
			}
		}
		return false;
	},
});
