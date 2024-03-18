/**
 * 筛选模式
 */
export enum FilterMode {
	NUMBER = '数字筛选',
	TEXT = '文本筛选',
	ENTITY = '实体筛选',
	DATE = '日期筛选',
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
export enum QueryConditions {
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
 * 文本数字筛选配置
 */
export interface FilterConfig {
	// 两个条件之间的逻辑操作
	logicalOperators: LogicalOperators;
	// 第一个查询条件
	firstQueryCondition: QueryConditions;
	// 第一个查询文本
	firstQueryText: string;
	// 第二个查询条件
	secondQueryCondition: QueryConditions;
	// 第二个查询文本
	secondQueryText: string;
}

export interface FilterTextInstance {
	getTextFilterConfig(): FilterConfig;
}

export interface FilterNumberInstance {
	getNumberFilterConfig(): FilterConfig;
}
/**
 * 自定义的筛选器
 */
export interface DeepFilterConfig {
	filterModes: Array<FilterMode>;
	currentFilterMode: FilterMode;
	textFilterConfig?: FilterConfig;
	numberFilterConfig?: FilterConfig;
}
