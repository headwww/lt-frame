import { TreeProps } from 'ant-design-vue';

/**
 * 筛选模式
 */
export enum FilterMode {
	NUMBER = '数字筛选',
	TEXT = '文本筛选',
	ENTITY = '实体筛选',
	DATE = '日期筛选',
	// TIME = '时间筛选',
	CONTENT = '内容筛选',
}

/**
 * 逻辑操作符
 */
export enum LogicalOperators {
	AND = '与',
	OR = '或',
}

/**
 * 查询条件包括数字文本和字符文本
 */
export enum ComparisonOperator {
	EMPTY = '空',
	INCLUDE = '包含',
	EXCLUDE = '不包含',
	EQUALS = '等于',
	NOT_EQUALS = '不等于',
	GREATER_THAN = '大于',
	GREATER_THAN_OR_EQUAL = '大于或等于',
	LESS_THAN = '小于',
	LESS_THAN_OR_EQUAL = '小于或等于',
	STARTS_WITH = '开头是',
	DOES_NOT_START_WITH = '开头不是',
	ENDS_WITH = '结尾是',
	DOES_NOT_END_WITH = '结尾不是',
}

/**
 * 日期和时间的查询条件
 */
export enum TemporalOperator {
	EMPTY = '空',
	EQUALS = '等于',
	NOT_EQUALS = '不等于',
	AFTER = '在其之后',
	AFTER_OR_SAME = '在其之后或相同',
	BEFORE = '在其之前',
	BEFORE_OR_SAME = '在其之前或相同',
}

/**
 * 文本数字日期筛选配置
 */
export interface FilterConfig {
	// 两个条件之间的逻辑操作
	logicalOperators: LogicalOperators;
	// 第一个查询条件
	firstQueryCondition: ComparisonOperator | TemporalOperator;
	// 第一个查询文本 如果是日期筛选需要用dayjs处理
	firstQueryText: any;
	// 第二个查询条件
	secondQueryCondition: ComparisonOperator | TemporalOperator;
	// 第二个查询文本
	secondQueryText: any;
}

/**
 * 返回文本/数字/时间/日期筛选内设置的内容
 */
export interface FilterComponentInstance {
	getConfig(): FilterConfig;
}

/**
 * 内容筛选配置
 */
export interface ContentFilterConfig {
	// 树形控件可选项
	treeData: TreeProps['treeData'];
	// 选中的项 默认全选项是选中的
	checkedKeys: Array<any>;
}

export interface FilterContentInstance {
	// 返回数字筛选内设置的内容
	getConfig(): ContentFilterConfig;
}

/**
 * 实体筛选配置
 */
export interface EntityFilterConfig {
	// 选中的列
	currentRow: any;
}

export interface FilterEntityInstance {
	// 返回实体筛选内设置的内容
	getConfig(): EntityFilterConfig;
}

/**
 * 自定义的筛选器
 */
export interface DeepFilterConfig {
	filterModes: Array<FilterMode>;
	currentFilterMode: FilterMode;
	textFilterConfig?: FilterConfig;
	numberFilterConfig?: FilterConfig;
	contentFilterConfig?: ContentFilterConfig;
	dateFilterConfig?: FilterConfig;
	entityFilterConfig?: EntityFilterConfig;
}

/** 设置每个筛选模式的attrs */
export interface DeepFilterAttrs {
	// 参考antv input的文档配置
	textAttrs?: { [key: string]: any };
	// 参考antv inputNumber的文档配置
	numberAttrs?: { [key: string]: any };
	// 参考antv tree的文档配置
	contentAttrs?: { [key: string]: any };
	// 参考antv datePicker文档配置
	dateAttrs?: { [key: string]: any };
	// 实体筛选的配置
	entityAttrs?: {
		inputAttrs?: { [key: string]: any };
		tableAttrs: { [key: string]: any };
	};
}
