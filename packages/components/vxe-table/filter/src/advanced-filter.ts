import { Fn } from '@lt-frame/utils';
import { DatePickerProps } from 'ant-design-vue';
import { ExtractPropTypes, PropType } from 'vue';
import {
	VxeGlobalRendererHandles,
	VxeGridInstance,
	VxeGridProps,
} from 'vxe-table';

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
export interface FilterData {
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
 * 内容筛选配置
 */
export interface ContentFilterData {
	// 选中的项 默认全选项是选中的
	checkedKeys: Array<any>;
}

/**
 * 实体筛选配置
 */
export interface EntityFilterData {
	// 选中的row
	records: any[];
}

/**
 *  高级筛选配置筛选条件
 */
export interface AdvanceFilterData {
	// 默认使用的筛选器
	currentMode: FilterMode;
	textFilterData?: FilterData;
	numberFilterData?: FilterData;
	contentFilterData?: ContentFilterData;
	dateFilterData?: FilterData;
	entityFilterData?: EntityFilterData;
}

export const advanceFilterProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderFilterParams>,
	// 开启的筛选的模式
	filterModes: Array<FilterMode>,
	// 实体筛选需要提供的配置
	configs: Object as PropType<VxeGridProps>,
	// 实体筛选需要的请求
	ajax: {
		type: Function as PropType<Fn<VxeGridInstance, Promise<any>>>,
	},
	// 日期筛选是否开启时间
	datePickerProps: Object as PropType<DatePickerProps>,
};

export type AdvanceFilterProps = ExtractPropTypes<typeof advanceFilterProps>;
