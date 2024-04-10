<script lang="tsx">
import { useNamespace } from '@lt-frame/hooks';
import {
	Ref,
	computed,
	defineComponent,
	nextTick,
	onMounted,
	provide,
	reactive,
	ref,
	watch,
} from 'vue';
import XEUtils from 'xe-utils';
import { isFunction } from 'lodash-es';
import { isNullOrUnDef } from '@lt-frame/utils';
import {
	FormState,
	LtFormConstructor,
	Items,
	FormPrivateMethods,
	formProps,
	LtFormEmits,
	FormMethods,
	FormPrivateComputed,
} from './form';
import FormConfigItem from './form-config-item.vue';
import {
	createItem,
	getSlotVNs,
	isActivetem,
	handleFieldOrItem,
	isEnableConf,
	getResetValue,
} from './util';
import { Rule, validErrorRuleValue, ValidateErrorMapParams } from './rules';
import { ItemInfo } from './itemInfo';
import { LtRender } from './render';

export default defineComponent({
	name: 'LtForm',
	props: formProps,
	emits: [
		'update:collapseStatus',
		'collapse',
		'toggle-collapse',
		'submit',
		'submit-invalid',
		'reset',
	] as LtFormEmits,
	setup(props, context) {
		const { slots, emit } = context;
		const xID = XEUtils.uniqueId();

		const ns = useNamespace('form');
		const refElem = ref() as Ref<HTMLFormElement>;

		let formMethods = {} as FormMethods;

		const formState = reactive<FormState>({
			collapseAll: props.collapseStatus,
			staticItems: [],
			formItems: [],
		});

		const $ltform = {
			xID,
			props,
			formState,
			getComputeMaps: () => computeMaps,
		} as unknown as LtFormConstructor;

		const computeValidOpts = computed(() => ({ ...props.validConfig }));

		const computeMaps: FormPrivateComputed = {
			computeValidOpts,
		};

		const callSlot = (
			slotFunc: ((params: any) => any) | string | null,
			params: any
		) => {
			if (slotFunc) {
				if (XEUtils.isString(slotFunc)) {
					slotFunc = slots[slotFunc] || null;
				}
				if (XEUtils.isFunction(slotFunc)) {
					return getSlotVNs(slotFunc(params));
				}
			}
			return [];
		};

		const loadItem = (list: Items) => {
			if (list.length) {
				formState.staticItems = XEUtils.mapTree(
					list,
					(item) => createItem($ltform, item),
					{ children: 'children' }
				);
			}
			return nextTick();
		};

		const getItems = () => {
			const itemList: ItemInfo[] = [];
			XEUtils.eachTree(
				formState.formItems,
				(item) => {
					itemList.push(item);
				},
				{ children: 'children' }
			);
			return itemList;
		};

		const getItemByField = (field: string) => {
			const rest = XEUtils.findTree(
				formState.formItems,
				(item) => item.field === field,
				{ children: 'children' }
			);
			return rest ? rest.item : null;
		};

		const getCollapseStatus = () => formState.collapseAll;

		const toggleCollapse = () => {
			const status = !getCollapseStatus();
			formState.collapseAll = status;
			emit('update:collapseStatus', status);
			return nextTick();
		};

		/** 展开收起事件 */
		const toggleCollapseEvent = (e: Event) => {
			toggleCollapse();
			const status = getCollapseStatus();
			formMethods.dispatchEvent(
				'toggle-collapse',
				{ status, collapse: status, data: props.data },
				e
			);
			formMethods.dispatchEvent(
				'collapse',
				{ status, collapse: status, data: props.data },
				e
			);
		};

		/** 定位到第一个 */
		const handleFocus = (fields: string[]) => {
			fields;
		};

		/**
		 * 清楚验证 未指定具体清除的项则全部清除
		 * @param fieldOrItem 需要清除的项或者字段
		 */
		const clearValidate = (
			fieldOrItem?: string | string[] | ItemInfo | ItemInfo[]
		) => {
			if (fieldOrItem) {
				let fields: any = fieldOrItem;
				if (!XEUtils.isArray(fieldOrItem)) {
					fields = [fieldOrItem];
				}
				fields.forEach((field: any) => {
					if (field) {
						const item = handleFieldOrItem($ltform, field);
						if (item) {
							item.showError = false;
						}
					}
				});
			} else {
				getItems().forEach((item) => {
					item.showError = false;
				});
			}
			return nextTick();
		};
		const reset = () => {
			const { data } = props;
			const itemList = getItems();
			if (data) {
				itemList.forEach((item) => {
					const { field, resetValue, itemRender } = item;
					if (isEnableConf(itemRender)) {
						const compConf = LtRender.renderer.get(itemRender.name);
						if (compConf && compConf.itemResetMethod) {
							compConf.itemResetMethod({
								data,
								field,
								item,
								$form: $ltform,
							});
						} else if (field) {
							XEUtils.set(
								data,
								field,
								resetValue === null
									? getResetValue(XEUtils.get(data, field), undefined)
									: XEUtils.clone(resetValue, true)
							);
						}
					}
				});
			}
			return clearValidate();
		};
		/**
		 * 校验数据
		 */
		const validItemRules = (
			validType: string,
			fields: string | string[],
			val?: any
		) => {
			const { data, rules: formRules } = props;
			const errorMaps: ValidateErrorMapParams = {};

			if (!XEUtils.isArray(fields)) {
				fields = [fields];
			}
			return Promise.all(
				fields.map((property) => {
					const errorRules: Rule[] = [];
					const syncVailds: Promise<any>[] = [];
					if (property && formRules) {
						const rules = XEUtils.get(formRules, property);
						if (rules) {
							const itemValue = XEUtils.isUndefined(val)
								? XEUtils.get(data, property)
								: val;
							rules.forEach((rule) => {
								const { type, trigger, required, validator } = rule;
								if (validType === 'all' || !trigger || validType === trigger) {
									// 自定义验证规则 未写完
									if (validator) {
										const validParams = {
											itemValue,
											rule,
											rules,
											data,
											field: property,
											property,
											$form: $ltform,
										};
										const customValid =
											isFunction(validator) && validator(validParams);
										if (customValid) {
											if (XEUtils.isError(customValid)) {
												errorRules.push(
													new Rule({
														type: 'custom',
														trigger,
														content: customValid.message,
														rule: new Rule(rule),
													})
												);
											} else if (customValid.catch) {
												// 如果为异步校验（注：异步校验是并发无序的）
												syncVailds.push(
													customValid.catch((e: any) => {
														errorRules.push(
															new Rule({
																type: 'custom',
																trigger,
																content: e ? e.message : rule.content,
																rule: new Rule(rule),
															})
														);
													})
												);
											}
										}
									} else {
										const isArrType = type === 'array';
										const isArrVal = XEUtils.isArray(itemValue);
										let hasEmpty = true;
										if (isArrType || isArrVal) {
											hasEmpty = !isArrVal || !itemValue.length;
										} else if (XEUtils.isString(itemValue)) {
											hasEmpty =
												itemValue.trim() === '' ||
												isNullOrUnDef(itemValue.trim());
										} else {
											hasEmpty = itemValue === '' || isNullOrUnDef(itemValue);
										}
										if (
											required
												? hasEmpty || validErrorRuleValue(rule, itemValue)
												: !hasEmpty && validErrorRuleValue(rule, itemValue)
										) {
											errorRules.push(new Rule(rule));
										}
									}
								}
							});
						}
					}

					return Promise.all(syncVailds).then(() => {
						if (errorRules.length) {
							errorMaps[property] = errorRules.map((rule) => ({
								$form: $ltform,
								rule,
								data,
								field: property,
							}));
						}
					});
				})
			).then(() => {
				if (!XEUtils.isEmpty(errorMaps)) {
					return Promise.reject(errorMaps);
				}
			});
		};

		let showErrTime: number;

		const beginValidate = (
			itemList: ItemInfo[],
			type?: string,
			callback?: any
		): Promise<any> => {
			const { data, rules: formRules } = props;
			const validOpts = computeValidOpts.value;
			const validRest: any = {};
			const validFields: string[] = [];
			const itemValids: any[] = [];

			clearTimeout(showErrTime);
			if (data && formRules) {
				itemList.forEach((item) => {
					const { field, visible } = item;
					if (field && !(visible === false) && isActivetem($ltform, item)) {
						itemValids.push(
							validItemRules(type || 'all', field)
								.then(() => {
									item.errRule = null;
								})
								.catch((errorMaps: ValidateErrorMapParams) => {
									const rest = errorMaps[field];
									if (!validRest[field]) {
										validRest[field] = [];
									}
									validRest[field].push(rest);
									validFields.push(field);
									item.errRule = rest[0].rule;
									return Promise.reject(rest);
								})
						);
					}
				});
				return Promise.all(itemValids)
					.then(() => {
						if (callback) {
							callback();
						}
					})
					.catch(
						() =>
							new Promise<void>((resolve) => {
								showErrTime = window.setTimeout(() => {
									itemList.forEach((item) => {
										if (item.errRule) {
											item.showError = true;
										}
									});
								}, 20);
								if (validOpts.autoPos !== false) {
									nextTick(() => {
										handleFocus(validFields);
									});
								}
								if (callback) {
									callback(validRest);
									resolve();
								} else {
									resolve(validRest);
								}
							})
					);
			}
			if (callback) {
				callback();
			}
			return Promise.resolve();
		};

		const validate = (callback: any) => {
			clearValidate();
			return beginValidate(getItems(), '', callback);
		};

		const validateField = (
			fieldOrItem: string | string[] | ItemInfo | ItemInfo[],
			callback: any
		) => {
			let fields: any[] = [];
			if (XEUtils.isArray(fieldOrItem)) {
				fields = fieldOrItem;
			} else {
				fields = [fieldOrItem];
			}
			return beginValidate(
				fields.map((field) => handleFieldOrItem($ltform, field) as ItemInfo),
				'',
				callback
			);
		};

		const submitEvent = (evnt: Event) => {
			evnt.preventDefault();
			if (!props.preventSubmit) {
				clearValidate();
				beginValidate(getItems()).then((errMap) => {
					if (errMap) {
						formMethods.dispatchEvent(
							'submit-invalid',
							{ data: props.data, errMap },
							evnt
						);
					} else {
						formMethods.dispatchEvent('submit', { data: props.data }, evnt);
					}
				});
			}
		};

		const resetEvent = (evnt: Event) => {
			evnt.preventDefault();
			reset();
			formMethods.dispatchEvent('reset', { data: props.data }, evnt);
		};

		const triggerItemEvent = (evnt: Event, field: string, itemValue?: any) => {
			if (field) {
				return validItemRules(
					evnt ? (['blur'].includes(evnt.type) ? 'blur' : 'change') : 'all',
					field,
					itemValue
				)
					.then(() => {
						clearValidate(field);
					})
					.catch((errorMaps: ValidateErrorMapParams) => {
						const rest = errorMaps[field];
						const item = getItemByField(field);
						if (rest && item) {
							item.showError = true;
							item.errRule = rest[0].rule;
						}
					});
			}
			return nextTick();
		};

		/**
		 * 更新项状态
		 * 如果组件值 v-model 发生 change 时，调用改函数用于更新某一项编辑状态
		 * 如果单元格配置了校验规则，则会进行校验
		 */
		const updateStatus = (scope: any, itemValue?: any) => {
			const { field } = scope;
			return triggerItemEvent(new Event('change'), field, itemValue);
		};

		formMethods = {
			dispatchEvent(type, params, evnt) {
				emit(type, { $form: $ltform, $event: evnt, ...params });
			},
			reset,
			getItems,
			validate,
			validateField,
			clearValidate,
			getItemByField,
			updateStatus,
			toggleCollapse,
		};

		const formPrivateMethods: FormPrivateMethods = {
			callSlot,
			triggerItemEvent,
			toggleCollapseEvent,
		};

		Object.assign($ltform, formMethods, formPrivateMethods);

		const staticItemFlag = ref(0);
		watch(
			() => formState.staticItems.length,
			() => {
				staticItemFlag.value++;
			}
		);
		watch(
			() => formState.staticItems,
			() => {
				staticItemFlag.value++;
			}
		);
		watch(staticItemFlag, () => {
			formState.formItems = formState.staticItems;
		});

		const itemFlag = ref(0);
		watch(
			() => (props.items ? props.items.length : -1),
			() => {
				itemFlag.value++;
			}
		);
		watch(
			() => props.items,
			() => {
				itemFlag.value++;
			}
		);
		watch(itemFlag, () => {
			loadItem(props.items || []);
		});

		watch(
			() => props.collapseStatus,
			(value) => {
				formState.collapseAll = !!value;
			}
		);

		onMounted(() => {
			loadItem(props.items || []);
		});

		const renderNoneSlots = () => {
			const { customLayout } = props;
			const defaultSlot = slots.default;
			return (
				<div class={ns.b('slots')}>
					{{
						default: () =>
							customLayout ? [] : defaultSlot ? defaultSlot({}) : [],
					}}
				</div>
			);
		};

		const renderFormItem = () => {
			const defaultSlot = slots.default ? slots.default({}) : [];
			const { customLayout } = props;
			const { formItems } = formState;

			return (
				<div class={[ns.m('wrapper'), 'lt-row']}>
					{customLayout
						? defaultSlot
						: formItems.map((item, index) => (
								<FormConfigItem key={index} itemConfig={item}></FormConfigItem>
							))}
				</div>
			);
		};

		const renderVN = () => {
			const { className, data } = props;
			const getClassName = className
				? isFunction(className)
					? className({ items: formState.formItems, data, $form: $ltform })
					: className
				: '';

			const on = {
				onSubmit: submitEvent,
				onReset: resetEvent,
			};
			return (
				<form {...on} ref={refElem} class={[ns.b(), getClassName]}>
					{renderFormItem()}
					{renderNoneSlots()}
				</form>
			);
		};

		$ltform.renderVN = renderVN;
		provide('$ltform', $ltform);
		return $ltform;
	},
	render() {
		return this.renderVN();
	},
});
</script>
