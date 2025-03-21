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
import {
	ComparisonOperator,
	FilterMode,
	LogicalOperators,
	LtDatasource,
	LtTablePlugins,
	TemporalOperator,
} from '@lt-frame/components';
import {
	Fn,
	deepMerge,
	isNullOrUnDef,
	removeNullProperties,
} from '@lt-frame/utils';
import * as lodash from 'lodash-es'; // 修改导入语句以获取所有 lodash 函数
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

	const tableFields = ref<TableFields>({});
	function buildTableOption(value: TableFields) {
		// 移除所有的null的属性
		value = removeNullProperties(value);
		tableFields.value = value;
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
			checkStrictly,
		} = value;

		const rules: { [key: string]: any } = {};

		let cols: VxeColumnProps[] = [];
		if (columns) {
			cols = columns.map((item, index) => {
				let editRender = {};
				let formatter;
				let filter = {};
				if (item) {
					editRender = setEditRender(item);
					formatter = setFormatter(item);
					filter = setFilter(item);
					if (item.field) {
						set(rules, item.field.value, item.json);
					}
					return {
						field: item.field && item.field.value,
						title: item.title,
						width: item.width,
						sortable: item.sortable,
						fixed: item.fixed,
						editRender,
						formatter: formatter && formatter,
						treeNode: isTree.value && index === 0,
						...filter,
					} as VxeColumnProps;
				}
				return {};
			});
		}
		if (seq) {
			cols.push({
				field: 'seq',
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

		options.value.border = isUndefined(border) ? 'full' : (border as any);
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
				checkStrictly,
			};
		} else {
			options.value.checkboxConfig = {
				isShiftKey: true,
				range: true,
				checkStrictly,
			};
		}
		if (buttons) {
			toolButtons.value = [];
			buttons.forEach((item) => {
				if (item) {
					toolButtons.value.push({
						title: item.title && item.title,
						type: isNullOrUnDef(item.type) ? undefined : item.type,
						bindClick: item.bindClick && item.bindClick,
						bindDisabled: item.bindDisabled && item.bindDisabled,
					});
				}
			});
		}
	}

	function setEditRender(item: Column) {
		const { field, datasourceContrast, isTime, conditionExpr, isPager } = item;

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
						field: 'seq',
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
							name: isPager
								? LtTablePlugins.EditEntityPager
								: LtTablePlugins.EditEntity,
							props: {
								configs: {
									columns,
								},
								ajax: isPager
									? (page: any, value: any) =>
											datasourceContrast.key &&
											LtDatasource.get(datasourceContrast.key).createDatasource(
												fields,
												{
													expr: conditionExpr,
													pager: { ...page },
													value,
												}
											)
									: () =>
											datasourceContrast.key &&
											LtDatasource.get(datasourceContrast.key).createDatasource(
												fields,
												{
													expr: conditionExpr,
												}
											),
							},
						};
					} else if (datasourceContrast?.type === 'customDatasource') {
						// 自定义数据源
						edit = {
							name: isPager
								? LtTablePlugins.EditEntityPager
								: LtTablePlugins.EditEntity,
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
						if (isTime) {
							edit = {
								name: LtTablePlugins.EditTimePicker,
							};
						} else {
							edit = {
								name: LtTablePlugins.EditDatePicker,
								props: {
									showTime: isUndefined(item.showTime) ? false : item.showTime,
								},
							};
						}
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
		const { field, isTime } = item;
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
					if (isTime) {
						formatter = [LtTablePlugins.FormatterTimeHMS];
					} else {
						formatter = [LtTablePlugins.FormatterTime, item.dataFormatter];
					}
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

	function setFilter(item: Column) {
		const {
			isFilter,
			field,
			showTime,
			datasourceContrast,
			conditionExpr,
			isPager,
		} = item;

		if (isFilter && field) {
			const filterModes: string[] = [];
			const filterComProps: { [key: string]: any } = {};
			filterComProps.isPager = isPager;
			if (field.fieldType === 'java.lang.String') {
				filterModes.push(FilterMode.TEXT);
			}
			if (
				field.fieldType === 'java.lang.Integer' ||
				field.fieldType === 'java.lang.Long' ||
				field.fieldType === 'java.math.BigDecimal'
			) {
				filterModes.push(FilterMode.NUMBER);
			}
			if (field.fieldType === 'java.util.Date') {
				filterModes.push(FilterMode.DATE);
				filterComProps.datePickerProps = {
					showTime,
				};
			}
			if (field.parentType) {
				if (datasourceContrast) {
					filterModes.unshift(FilterMode.ENTITY);
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
						field: 'seq',
						type: 'seq',
						title: '#',
						width: 40,
						fixed: 'left',
						align: 'center',
					});
					columns.push({
						type: 'checkbox',
						width: 50,
						fixed: 'left',
						align: 'center',
					});
					filterComProps.configs = {
						columns,
					};
					if (datasourceContrast.type === 'builtInDatasource') {
						// 内置数据源
						const fields: string[] = [];
						columns.forEach((item) => {
							if (item.field) {
								fields.push(item.field);
							}
						});

						filterComProps.ajax = isPager
							? (page: any, value: any) =>
									datasourceContrast.key &&
									LtDatasource.get(datasourceContrast.key).createDatasource(
										fields,
										{
											expr: conditionExpr,
											pager: { ...page },
											value,
										}
									)
							: () =>
									datasourceContrast.key &&
									LtDatasource.get(datasourceContrast.key).createDatasource(
										fields,
										{
											expr: conditionExpr,
										}
									);
					} else if (datasourceContrast?.type === 'customDatasource') {
						filterComProps.ajax = () =>
							datasourceContrast.key &&
							datasource &&
							datasource[datasourceContrast.key];
					}
				}
			}
			filterModes.push(FilterMode.CONTENT);
			return {
				filters: [
					{
						data: {
							// 选中的筛选方式
							currentMode: filterModes.length > 0 ? filterModes[0] : '',
							// 数字筛选配置
							textFilterData: {
								// 两个条件之间的逻辑操作
								logicalOperators: LogicalOperators.AND,
								// 第一个查询条件
								firstQueryCondition: ComparisonOperator.INCLUDE,
								// 第一个查询文本
								firstQueryText: '',
								// 第二个查询条件
								secondQueryCondition: ComparisonOperator.EMPTY,
								// 第二个查询文本
								secondQueryText: '',
							},
							// 数字筛选配置
							numberFilterData: {
								// 两个条件之间的逻辑操作
								logicalOperators: LogicalOperators.AND,
								// 第一个查询条件
								firstQueryCondition: ComparisonOperator.INCLUDE,
								// 第一个查询文本
								firstQueryText: '',
								// 第二个查询条件
								secondQueryCondition: ComparisonOperator.EMPTY,
								// 第二个查询文本
								secondQueryText: '',
							},
							// 日期筛选配置
							dateFilterData: {
								logicalOperators: LogicalOperators.AND,
								firstQueryCondition: TemporalOperator.EQUALS,
								firstQueryText: '',
								secondQueryCondition: TemporalOperator.EMPTY,
								secondQueryText: '',
							},
							contentFilterConfig: {
								checkedKeys: ['$_SELECT_ALL'],
							},
						},
					},
				],
				filterRender: {
					name: LtTablePlugins.FilterAdvanced,
					props: {
						filterModes,
						...filterComProps,
					},
				},
			};
		}

		return {};
	}

	// 更新统计数据的函数
	const updateFootCount = (list: any[] = []) => {
		options.value.showFooter = true;

		const { columns } = tableFields.value;
		const createStatObjects = () => {
			const fields = columns?.map((f) => f.field?.fieldName)!;
			const methodTypes = new Set<string>();

			// 收集所有可能的统计方法类型
			columns?.forEach((field) => {
				field.footer?.forEach((item) => {
					methodTypes.add(item.title);
				});
			});

			// 为每种统计方法创建对应的响应式对象
			const statObjects: Record<string, any> = {};
			methodTypes.forEach((type) => {
				statObjects[type] = {
					seq: type,
					// @ts-ignore
					...Object.fromEntries(fields.map((field) => [field, ''])),
				};
			});

			return statObjects;
		};
		const statObjects = createStatObjects();

		columns!.forEach((config) => {
			if (config.footer) {
				config.footer.forEach((method) => {
					// 使用 method.title 直接从 statObjects 中获取对应的统计对象
					const targetObj = statObjects[method.title];
					if (targetObj) {
						targetObj[config.field!.fieldName!] = executeScript(
							method.script,
							list,
							config.field!.fieldName!
						);
					}
				});
			}
		});
		options.value.footerData = Object.values(statObjects);
	};

	// 执行统计脚本的函数
	const executeScript = (script: string, list: any[], field: string) => {
		// 提取函数名和函数体
		const functionName = script.trim().match(/function\s+(\w+)/)?.[1];
		if (!functionName) {
			throw new Error('无法解析函数名');
		}

		// eslint-disable-next-line no-new-func
		const fn = new Function(
			'list',
			'field',
			'lodash',
			`
		${script}
		return ${functionName}(list, field, lodash);
	`
		);
		return fn(list, field, lodash);
	};

	executeScript;

	return {
		updateFootCount,
		buildTableOption,
		options,
		toolButtons,
		gridEvents,
	};
}
