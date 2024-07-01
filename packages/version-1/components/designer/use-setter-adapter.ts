import { computed, ref } from 'vue';
import { VxeColumnProps, VxeGridListeners, VxeGridProps } from 'vxe-table';
import {
	isArray,
	isBoolean,
	isFunction,
	isUndefined,
	omit,
	set,
} from 'lodash-es';
import { LtDatasource, LtTablePlugins } from '@lt-frame/components';
import { Fn, deepMerge } from '@lt-frame/utils';
import { Column, TableFields, ToolButtons } from './config';
import { TableProps } from './material/table';

/**
 * 将设置器生产的数据转换为需要的数据
 *
 */
export function useSetterAdapter(props: TableProps) {
	const { datasource, config, eventBus } = props;
	const isTree = computed(() => !isUndefined(props.config?.treeConfig));
	const options = ref<VxeGridProps>(
		deepMerge(
			{
				columns: [],
				data: [
					{ $id: 0, $parentId: null },
					{ $id: 1, $parentId: null },
					{ $id: 3, $parentId: 0 },
					{ $id: 4, $parentId: 1 },
					{ $id: 5, $parentId: 1 },
				],
			} as VxeGridProps,
			omit(config, 'data', 'loading')
		)
	);

	const gridEvents = ref<VxeGridListeners>({
		...props.listeners,
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
						const fields: string[] = [];
						columns.forEach((item) => {
							if (item.field) {
								fields.push(item.field);
							}
						});
						edit = {
							name: LtTablePlugins.EditEntity,
							props: {
								configs: {
									columns,
								},
								ajax: () =>
									datasourceContrast.key &&
									LtDatasource.get(datasourceContrast.key).createDatasource(
										fields
									),
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
					if (field.fieldType === 'java.lang.Boolean') {
						edit = {
							name: LtTablePlugins.EditBool,
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
				if (field.fieldType === 'java.lang.Boolean') {
					formatter = ({ cellValue }: any) =>
						cellValue
							? item.boolTrue
								? item.boolTrue
								: '是'
							: item.boolFalse
								? item.boolFalse
								: '否';
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
			border,
			showOverflow,
			editMode,
			editTrigger,
			toolButtons: buttons,
			menuConfig,
			isOperationColumn,
			editButton,
			viewButton,
			viewBindClick,
			viewDisabled,
			editDisabled,
		} = value;

		const rules: { [key: string]: any } = {};

		let cols: VxeColumnProps[] = [];
		if (columns) {
			cols = columns.map((item, index) => {
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
						treeNode: isTree.value && index === 0,
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

		if (isOperationColumn) {
			let viewFn: boolean | Fn = false;
			if (
				viewDisabled?.type === 'customDatasource' &&
				viewDisabled.key &&
				datasource
			) {
				if (isFunction(datasource[viewDisabled.key])) {
					viewFn = (row: any) => datasource[viewDisabled.key!!](row);
				} else {
					viewFn = datasource[viewDisabled.key];
				}
			}
			let editFn: boolean | Fn = false;
			if (
				editDisabled?.type === 'customDatasource' &&
				editDisabled.key &&
				datasource
			) {
				if (isFunction(datasource[editDisabled.key])) {
					editFn = (row: any) => datasource[editDisabled.key!!](row);
				} else {
					editFn = datasource[editDisabled.key];
				}
			}
			cols.push({
				title: '操作',
				align: 'center',
				fixed: 'right',
				width: 160,
				cellRender: {
					name: LtTablePlugins.CellOperate,
					props: {
						viewVisible: viewButton,
						viewDisabled: viewFn,
						editVisible: editButton,
						editDisabled: editFn,
					},
					events: {
						onViewClick: (params) => {
							if (viewBindClick) {
								eventBus[viewBindClick](params);
							}
						},
					},
				},
			});
		}

		// 右键菜单
		if (menuConfig && menuConfig.length > 0) {
			const menus = menuConfig.map((menu) => ({
				code: menu.code,
				name: menu.name,
			}));

			if (options.value.menuConfig) {
				if (options.value.menuConfig.body) {
					if (
						options.value.menuConfig.body.options &&
						options.value.menuConfig.body.options.length > 0
					) {
						options.value.menuConfig.body.options = [[]];
						options.value.menuConfig.body.options.push(menus);

						options.value.menuConfig.visibleMethod = (params: any) => {
							menuConfig.forEach((menu) => {
								const { options } = params;
								options.forEach((list: any[]) => {
									list.forEach((item: any) => {
										if (item.code === menu.code && menu.isDisabled) {
											const { type, key } = menu.isDisabled;
											if (type === 'customDatasource' && key) {
												if (isFunction(datasource[key])) {
													item.disabled = datasource[key](params);
												} else {
													item.disabled = datasource[key];
												}
											}
										}
									});
								});
							});

							return true;
						};
						menuConfig.forEach((item) => {
							gridEvents.value.menuClick = (params: any) => {
								const { menu } = params;
								if (menu.code === item.code) {
									eventBus[item.bindClick](params);
								}
							};
						});
					}
				}
			} else {
				// eslint-disable-next-line no-console
				console.warn(
					`
					父组件表格的v-bind配置属性需要初始化
					menuConfig: {
						body: {
							options: [[]],
						},
					},
					辅助dom产生菜单容器!
					`
				);
			}
		}

		options.value.editConfig = {
			mode: editMode && (editMode as any),
			trigger: editTrigger && (editTrigger as any),
		};

		options.value.border = isUndefined(border) ? 'none' : (border as any);
		options.value.columns = [...cols];
		options.value.stripe = isBoolean(stripe) ? stripe : false;
		options.value.size = isUndefined(size) ? '' : (size as any);
		options.value.align = isUndefined(align) ? '' : (align as any);
		options.value.showOverflow = isUndefined(showOverflow)
			? null
			: showOverflow;
		options.value.editRules = rules && { ...rules };
		options.value.autoResize = true;
		options.value.height = 'auto';

		if (isTree.value) {
			options.value.stripe = false;
			options.value.checkboxConfig = {
				isShiftKey: false,
				range: false,
			};
		} else {
			options.value.checkboxConfig = {
				isShiftKey: true,
				range: true,
			};
		}
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
		gridEvents,
	};
}
