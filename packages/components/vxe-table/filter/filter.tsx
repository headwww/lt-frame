import { VXETable } from 'vxe-table';
import { isFunction, isNullOrUnDef } from '@lt-frame/utils';
import { get, isArray, join, split } from 'lodash-es';
import XEUtils from 'xe-utils';
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

		let cellV = params.cellValue;
		if (formatter) {
			if (isFunction(formatter)) {
				cellV = formatter({ cellValue: params.cellValue, row: null, column });
			} else {
				if (isArray(formatter)) {
					if (formatter.length > 0) {
						const fm = VXETable.formats.get(formatter[0]).cellFormatMethod;
						if (isFunction(fm)) {
							cellV = fm(
								{ cellValue: params.cellValue, row: null, column },
								...XEUtils.slice(formatter, 1)
							);
						}
					}
				} else {
					const fm = VXETable.formats.get(formatter).cellFormatMethod;
					if (isFunction(fm)) {
						cellV = fm({ cellValue: params.cellValue, row: null, column });
					}
				}
			}
		}

		const { data } = column.filters[0];

		if (data.currentMode === FilterMode.TEXT) {
			return compareFilter(data.currentMode, cellV, data.textFilterData);
		}
		if (data.currentMode === FilterMode.NUMBER) {
			return compareFilter(data.currentMode, cellV, data.numberFilterData);
		}
		if (data.currentMode === FilterMode.DATE) {
			return compareFilter(data.currentMode, cellV, data.dateFilterData);
		}
		if (data.currentMode === FilterMode.CONTENT) {
			const arr: Array<any> = data.contentFilterData.checkedKeys;
			if (arr.includes('$_SELECT_ALL')) {
				return true;
			}
			if (isNullOrUnDef(cellV) || cellV === '') {
				cellV = '$_SELECT_NULL';
			}
			return arr.includes(cellV);
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
