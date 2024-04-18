import { VXETable } from 'vxe-table';
import { isFunction, isNullOrUnDef } from '@lt-frame/utils';
import { get, join, split } from 'lodash-es';
import AdvancedFilter from './src/advanced-filter.vue';
import { useResetFilter } from './src/use-reset-filter';
import { FilterMode } from './src/advanced-filter';
import { compareFilter } from './src/util';

VXETable.renderer.add('$lt-filter', {
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
				currentMode: option.data.currentMode,
				textFilterData: resetTextFilter(),
				numberFilterData: resetNumberFilter(),
				dateFilterData: resetDateFilter(),
				contentFilterData: resetContentFilter(),
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
		if (data.currentMode === FilterMode.TEXT) {
			return compareFilter(data.currentMode, cellValue, data.textFilterData);
		}
		if (data.currentMode === FilterMode.NUMBER) {
			return compareFilter(data.currentMode, cellValue, data.numberFilterData);
		}
		if (data.currentMode === FilterMode.DATE) {
			return compareFilter(data.currentMode, cellValue, data.dateFilterData);
		}
		if (data.currentMode === FilterMode.CONTENT) {
			const arr: Array<any> = data.contentFilterData.checkedKeys;
			if (arr.includes('$_SELECT_ALL')) {
				return true;
			}
			if (isNullOrUnDef(cellValue) || cellValue === '') {
				cellValue = '$_SELECT_NULL';
			}
			return arr.includes(cellValue);
		}

		if (data.currentMode === FilterMode.ENTITY) {
			const splitList = split(params.column.field, '.');
			if (splitList.length > 1) {
				splitList.shift();
				const otherKey = join(splitList, '.');
				const arr: string[] = [];
				if (data.entityFilterData.records.length > 0) {
					data.entityFilterData.records.forEach((item: any) => {
						arr.push(get(item, otherKey));
					});
				}
				return arr.includes(rawValue);
			}
		}
		return false;
	},
});
