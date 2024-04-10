import {
	ComponentPublicInstance,
	ComputedRef,
	ExtractPropTypes,
	PropType,
	RenderFunction,
	VNode,
} from 'vue';
import { ItemInfo } from './itemInfo';
import { Align, LtFormItemProps, TitleOverflow } from './form-item';
import { Rules, ValidateErrorMapParams } from './rules';

export type SlotVNodeType = VNode | string | number;

/**
 * 这些数据主要用于管理表单的状态，包括展开状态、静态表单项和动态表单项等
 */
export interface FormState {
	collapseAll: boolean;
	staticItems: any[];
	formItems: ItemInfo[];
}

export type ValueOf<T> = T extends any[] ? T[number] : T[keyof T];

export type LtFormEmits = [
	'update:collapseStatus',
	'collapse',
	'toggle-collapse',
	'submit',
	'submit-invalid',
	'reset',
];

export interface FormMethods {
	dispatchEvent(type: ValueOf<LtFormEmits>, params: any, evnt: Event): void;
	/**
	 * 重置表单
	 */
	reset(): Promise<any>;
	/**
	 * 对表单进行校验，参数为一个回调函数。该回调函数会在校验结束后被调用 callback(errMap)。若不传入回调函数，则会返回一个 promise
	 * @param callback 回调函数
	 */
	validate(
		callback?: (errMap?: ValidateErrorMapParams) => void
	): Promise<ValidateErrorMapParams>;
	/**
	 * 对表单指定项进行校验，参数为一个回调函数。该回调函数会在校验结束后被调用 callback(errMap)。若不传入回调函数，则会返回一个 promise
	 * @param callback 回调函数
	 */
	validateField(
		field: string | string[] | ItemInfo | ItemInfo[],
		callback?: (errMap?: ValidateErrorMapParams) => void
	): Promise<ValidateErrorMapParams>;
	/**
	 * 手动清除校验状态，如果指定 field 则清除指定的项，否则清除整个表单
	 * @param field 字段名
	 */
	clearValidate(
		field?: string | string[] | ItemInfo | ItemInfo[]
	): Promise<any>;
	/**
	 * 更新项状态
	 * 当使用自定义渲染时可能会用到
	 * @param params 插槽对象
	 */
	updateStatus(
		params: {
			field: string;
		},
		itemValue?: any
	): void;
	/**
	 * 获取表单项列表
	 */
	getItems(): ItemInfo[];
	/**
	 * 根据列的字段名获取表单项
	 * @param field 字段名
	 *
	 */
	getItemByField(field: string): ItemInfo | null;
	/**
	 * 手动切换折叠状态
	 */
	toggleCollapse(): Promise<any>;
}

export interface FormPrivateMethods {
	callSlot<T>(
		slotFunc: ((params: T) => SlotVNodeType | SlotVNodeType[]) | string | null,
		params: T
	): SlotVNodeType[];
	toggleCollapseEvent(evnt: Event): void;
	triggerItemEvent(
		evnt: Event | { type: string },
		field: string,
		itemValue?: any
	): Promise<any>;
}

export interface LtFormConstructor extends FormMethods {
	xID: string;
	props: FormProps;
	formState: FormState;
	renderVN: RenderFunction;
	getComputeMaps(): FormPrivateComputed;
}

export type Items = LtFormItemProps[];

interface ClassNameParams {
	$form: LtFormConstructor;
	data: any;
	items: ItemInfo[];
}

export type ValidConfig = {
	autoPos?: boolean;
	showMessage?: boolean;
};

export interface FormPrivateComputed {
	computeValidOpts: ComputedRef<ValidConfig>;
}
export type ClassName = string | ((params: ClassNameParams) => string);

export const formProps = {
	collapseStatus: { type: Boolean, default: true },

	data: Object as PropType<any>,
	span: {
		type: [String, Number] as PropType<string | number>,
		default: () => undefined,
	},
	align: { type: String as PropType<Align>, default: () => null },
	className: [String, Function] as PropType<string | ClassName>,
	titleWidth: {
		type: [String, Number] as PropType<string | number>,
		default: () => undefined,
	},
	titleAlign: { type: String as PropType<Align>, default: () => null },
	titleColon: { type: Boolean, default: () => true },
	titleAsterisk: { type: Boolean, default: () => true },
	titleOverflow: {
		type: [Boolean, String] as PropType<TitleOverflow>,
		default: null,
	},
	preventSubmit: { type: Boolean, default: () => false },

	validConfig: {
		type: Object as PropType<ValidConfig>,
		default: () => ({
			autoPos: true,
			showMessage: true,
		}),
	},
	vertical: { type: Boolean },
	items: Array as PropType<Items>,
	rules: Object as PropType<Rules>,

	customLayout: {
		type: Boolean,
	},
};

export type FormProps = ExtractPropTypes<typeof formProps>;

export type LtFormInstance = ComponentPublicInstance<
	FormProps,
	LtFormConstructor
>;
