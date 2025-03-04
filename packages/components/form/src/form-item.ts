import { PropType } from 'vue';
import { HelpProps } from '../../basic';
import { LtFormConstructor } from './form';
import { ItemInfo, SlotVNodeType } from './itemInfo';
import { RenderOptions } from './render';

export type Align = 'left' | 'center' | 'right' | '' | null;

export type TitleOverflow =
	| boolean
	| 'ellipsis'
	| 'title'
	| 'tooltip'
	| ''
	| null;

export interface LtFormItemProps {
	/** 标题 */
	title?: string;
	/** 字段名 */
	field?: string;
	/** 栅格占据的列数（共 24 分栏） */
	span?: string | number;
	/** 内容对齐方式 */
	align?: Align;
	/** 标签宽度 */
	titleWidth?: string | number;

	/** 标题对齐方式 */
	titleAlign?: Align;
	/** 是否显示标题冒号 */
	titleColon?: boolean;
	/** 使用垂直布局 */
	vertical?: boolean;
	/** 提示文本 */
	titleHelp?: Partial<HelpProps>;
	/** 给表单项附加 className */
	className?: string | ((params: ClassNameParams) => string);
	/** 重置的时候的默认值 */
	resetValue?: any;
	/** 给表单项内容附加 className */
	contentClassName?: string | ((params: FormItemContentRenderParams) => string);
	/** 给表单项内容附加样式 */
	contentStyle?:
		| Record<string, string | number>
		| ((
				params: FormItemContentRenderParams
		  ) => Record<string, string | number>);

	/** 给表单项标题附加 className */
	titleClassName?: string | ((params: FormItemTitleRenderParams) => string);

	/** 给表单项标题附加样式 */
	titleStyle?:
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>);

	/** 是否显示必填字段的红色星号 */
	titleAsterisk?: boolean;
	/** 是否显示 */
	visible?: boolean;
	/** 是否显示标题 */
	showTitle?: boolean;
	/** 该方法的返回值用来决定该项是否显示 */
	visibleMethod?: (params: FormItemTitleRenderParams) => boolean;

	/** 是否省略 */
	titleOverflow?: TitleOverflow;

	/** 默认收起 */
	folding?: boolean;

	/** 项渲染配置项 */
	itemRender?: RenderOptions;

	/** 是否是折叠节点开启则创建一个折叠按钮 */
	collapseNode?: boolean;
	slots?: {
		title?: string | (() => SlotVNodeType | SlotVNodeType[]) | null;
		default?: string | (() => SlotVNodeType | SlotVNodeType[]) | null;
	};
	children?: LtFormItemProps[];
}
/**
 * 标题渲染参数
 */
export interface ClassNameParams {
	$form: LtFormConstructor;
	data: any;
	item: ItemInfo;
	field: string;
}
/**
 * 标题渲染参数
 */
export interface FormItemTitleRenderParams {
	$form: LtFormConstructor;
	data: any;
	item: ItemInfo;
	field: string;
}

/**
 * 内容渲染参数
 */
export interface FormItemContentRenderParams {
	$form: LtFormConstructor;
	data: any;
	item: ItemInfo;
	field: string;
}

/**
 * 项重置方法参数
 */
export interface FormItemResetParams {
	$form: LtFormConstructor;
	data: any;
	item: ItemInfo;
	field: string;
}

export const formItemProps = {
	title: String,
	field: String,
	span: [String, Number] as PropType<string | number>,
	align: String as PropType<Align>,
	titleAlign: {
		type: String as PropType<Align>,
		default: null,
	},
	titleWidth: {
		type: [String, Number] as PropType<string | number>,
		default: null,
	},
	titleColon: {
		type: Boolean,
		default: null,
	},
	titleAsterisk: {
		type: Boolean,
		default: null,
	},
	showTitle: {
		type: Boolean,
		default: true,
	},
	vertical: {
		type: Boolean,
		default: null,
	},
	className: [String, Function] as PropType<
		string | ((params: ClassNameParams) => string)
	>,
	contentClassName: [String, Function] as PropType<
		string | ((params: FormItemContentRenderParams) => string)
	>,
	contentStyle: [Object, Function] as PropType<
		| Record<string, string | number>
		| ((params: FormItemContentRenderParams) => Record<string, string | number>)
	>,
	titleClassName: [String, Function] as PropType<
		string | ((params: FormItemTitleRenderParams) => string)
	>,
	titleStyle: [Object, Function] as PropType<
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>)
	>,
	titleOverflow: {
		type: [Boolean, String] as PropType<TitleOverflow>,
		default: null,
	},
	titleHelp: Object as PropType<Partial<HelpProps>>,
	resetValue: {
		type: Object as PropType<any>,
		default: null,
	},
	visibleMethod: Function as PropType<
		(params: FormItemTitleRenderParams) => boolean
	>,
	visible: {
		type: Boolean,
		default: null,
	},
	folding: Boolean,
	collapseNode: Boolean,
	itemRender: Object as PropType<RenderOptions>,
};

export type LtFormItems = LtFormItemProps[];
