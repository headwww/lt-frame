import { ref } from 'vue';
import { VxeColumnProps, VxeGridProps } from 'vxe-table';
import { isArray, isBoolean, isUndefined, set } from 'lodash-es';
import { LtDatasource, LtTablePlugins } from '@lt-frame/components';
import { Column, TableFields, ToolButtons } from './config';
import { Datasource } from './material/table';

/**
 * 将设置器生产的数据转换为需要的数据
 *
 */
export function useSetterAdapter(datasource?: Datasource) {
	const options = ref<VxeGridProps>({
		columns: [],
		data: [{}, {}, {}, {}, {}],
	});

	const toolButtons = ref<ToolButtons[]>([]);

	function setEditRender(item: Column) {
		const { field, datasourceContrast } = item;
		let edit: { [key: string]: any } = {};
		if (field) {
			if (item.parentType) {
				if (datasourceContrast) {
					const columns: VxeColumnProps[] = [];
					item.entityColumn?.forEach((item) => {
						let formatter;
						if (item) {
							formatter = setFormatter(item);
							columns.push({
								title: item.title,
								width: item.width,
								field: item.field && item.field.value,
								formatter: formatter && formatter,
							});
						}
					});

					columns.push({
						type: 'seq',
						title: '#',
						width: 40,
						fixed: 'left',
						align: 'center',
					});
					if (datasourceContrast.type === 'builtInDatasource') {
						// 内置数据源
						edit = {
							name: LtTablePlugins.EditEntity,
							props: {
								configs: {
									columns,
								},
								ajax: () =>
									datasourceContrast.key &&
									LtDatasource.get(datasourceContrast.key).createDatasource(),
							},
						};
					} else if (datasourceContrast?.type === 'customDatasource') {
						// 自定义数据源
						edit = {
							name: LtTablePlugins.EditEntity,
							props: {
								configs: {
									columns,
								},
								ajax: () =>
									datasourceContrast.key &&
									datasource &&
									datasource[datasourceContrast.key],
							},
						};
					}
				}
			} else {
				if (field.fieldTypeFlag === '0') {
					if (field.fieldType === 'java.lang.String') {
						edit = {
							name: LtTablePlugins.EditInput,
							props: {
								allowClear: true,
							},
						};
					}
					if (
						field.fieldType === 'java.lang.Integer' ||
						field.fieldType === 'java.lang.Long' ||
						field.fieldType === 'java.math.BigDecimal'
					) {
						edit = {
							name: LtTablePlugins.EditInputNumber,
						};
					}
					if (field.fieldType === 'java.util.Date') {
						edit = {
							name: LtTablePlugins.EditDatePicker,
							props: {
								showTime: isUndefined(item.showTime) ? false : item.showTime,
							},
						};
					}
				}
				if (field.fieldTypeFlag === '2') {
					let options: any[] = [];
					if (isArray(field.enumInfo)) {
						options = field.enumInfo.map((item: any) => ({
							label: item.value,
							value: item.key,
						}));
					}
					edit = {
						name: LtTablePlugins.EditSelect,
						props: {
							options,
						},
					};
				}
			}
		}
		edit.enabled = item.isEdit;
		return edit;
	}

	function setFormatter(item: Column) {
		const { field } = item;
		let formatter;
		if (field) {
			if (field.fieldTypeFlag === '0') {
				if (
					field.fieldType === 'java.lang.Integer' ||
					field.fieldType === 'java.lang.Long' ||
					field.fieldType === 'java.math.BigDecimal'
				) {
					formatter = [
						LtTablePlugins.FormatterToFixedUnit,
						item.numberFormatter,
					];
				}
				if (field.fieldType === 'java.util.Date') {
					formatter = [LtTablePlugins.FormatterTime, item.dataFormatter];
				}
			}
			if (field.fieldTypeFlag === '2') {
				let options: any[] = [];
				if (isArray(field.enumInfo)) {
					options = field.enumInfo.map((item: any) => ({
						key: item.key,
						value: item.value,
					}));
				}
				formatter = [LtTablePlugins.FormatterEnum2, options];
			}
		}

		return formatter;
	}

	function buildTableOption(value: TableFields) {
		options.value.columns = [];
		const {
			columns,
			seq,
			radio,
			checkbox,
			stripe,
			size,
			align,
			showOverflow,
			toolButtons: buttons,
		} = value;

		const rules: { [key: string]: any } = {};

		let cols: VxeColumnProps[] = [];
		if (columns) {
			cols = columns.map((item) => {
				let editRender = {};
				let formatter;
				if (item) {
					editRender = setEditRender(item);
					formatter = setFormatter(item);
					if (item.field) {
						set(rules, item.field.value, item.json);
					}
					return {
						field: item.field && item.field.value,
						title: item.title,
						width: item.width,
						fixed: item.fixed,
						editRender,
						formatter: formatter && formatter,
					} as VxeColumnProps;
				}
				return {};
			});
		}
		if (seq) {
			cols.push({
				type: 'seq',
				fixed: 'left',
				width: 50,
				align: 'center',
				title: '#',
			});
		}
		if (checkbox) {
			cols.push({
				type: 'checkbox',
				fixed: 'left',
				width: 50,
				align: 'center',
			});
		}
		if (radio) {
			cols.push({
				type: 'radio',
				fixed: 'left',
				width: 50,
				align: 'center',
			});
		}
		options.value.editConfig = { mode: 'cell', trigger: 'click' };
		options.value.columns = [...cols];
		options.value.stripe = isBoolean(stripe) ? stripe : false;
		options.value.size = isUndefined(size) ? '' : (size as any);
		options.value.align = isUndefined(align) ? '' : (align as any);
		options.value.showOverflow = isUndefined(showOverflow)
			? null
			: showOverflow;
		options.value.editRules = rules && { ...rules };

		if (buttons) {
			toolButtons.value = [];

			buttons.forEach((item) => {
				if (item) {
					toolButtons.value.push({
						title: item.title && item.title,
						type: item.type && item.type,
						bindClick: item.bindClick && item.bindClick,
						bindDisabled: item.bindDisabled && item.bindDisabled,
					});
				}
			});
		}
	}

	return {
		buildTableOption,
		options,
		toolButtons,
	};
}
