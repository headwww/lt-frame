import { VXETable } from 'vxe-table';
import { isFunction, isNullOrUnDef } from '@lt-frame/utils';
import { get } from 'lodash-es';
import FilterDeep from './filter-deep.vue';
import { FilterMode } from './types';
import { compareFilter } from './util';
import { useResetFilter } from './use-reset-filter';

VXETable.renderer.add('Filter-Deep', {
	showFilterFooter: false,
	renderFilter(renderOpts, params) {
		return (
			<FilterDeep
				key={params.column.field}
				filterModes={renderOpts.props?.filterModes}
				entityConfig={renderOpts.props?.entityConfig}
				{...renderOpts.attrs}
				params={params}
			></FilterDeep>
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
			const { props } = params.column.filterRender;
			if (props) {
				const { entityConfig } = props;
				if (entityConfig) {
					const { compareField } = entityConfig;
					if (compareField) {
						return (
							rawValue === get(data.entityFilterConfig.currentRow, compareField)
						);
					}
				}
			}
		}
		return false;
	},
});
