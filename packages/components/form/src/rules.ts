import XEUtils from 'xe-utils';
import { LtFormConstructor } from './form';

/**
 *  校验规则配置项
 */
export interface Rules {
	[field: string]: FormRule[];
}

export type LtRules = Rules;

export interface FormRule {
	/**
	 * 是否必填
	 */
	required?: boolean;
	/**
	 * 最小长度/值
	 */
	min?: number;
	/**
	 * 最大长度/值
	 */
	max?: number;
	/**
	 * 数据类型
	 */
	type?: 'number' | 'string' | 'array' | '' | null;
	/**
	 * 使用正则表达式校验
	 */
	pattern?: string | RegExp;
	/**
	 * 使用自定义校验函数，接收一个 Promise
	 * @param params 参数
	 */
	validator?:
		| string
		| ((params: RuleValidatorParams) => void | Error | Promise<any>);
	/**
	 * 提示消息
	 */
	content?: string;
	trigger?: 'change' | '' | null;
	maxWidth?: number;
	/**
	 * @deprecated 已废弃，请使用 content
	 */
	message?: string;
}

export interface RuleValidatorParams {
	$form: LtFormConstructor;
	itemValue: any;
	rule: FormRule;
	rules: FormRule[];
	data: any;
	field: string;
}
export interface ValidateErrorParams {
	$form: LtFormConstructor;
	rule: FormRule;
	data: any;
	field: string;
}

export class Rule {
	constructor(rule: any) {
		Object.assign(this, {
			$options: rule,
			required: rule.required,
			min: rule.min,
			max: rule.min,
			type: rule.type,
			pattern: rule.pattern,
			validator: rule.validator,
			trigger: rule.trigger,
			maxWidth: rule.maxWidth,
		});
	}

	get content() {
		return this.$options.content;
	}

	get message() {
		return this.content;
	}

	[key: string]: any;
}

export const validErrorRuleValue = (rule: FormRule, val: any) => {
	const { type, min, max, pattern } = rule;
	const isNumType = type === 'number';
	const numVal = isNumType ? XEUtils.toNumber(val) : XEUtils.getSize(val);
	// 判断数值
	if (isNumType && XEUtils.isNaN(val)) {
		return true;
	}
	// 如果存在 min，判断最小值
	if (!XEUtils.eqNull(min) && numVal < XEUtils.toNumber(min)) {
		return true;
	}
	// 如果存在 max，判断最大值
	if (!XEUtils.eqNull(max) && numVal > XEUtils.toNumber(max)) {
		return true;
	}
	// 如果存在 pattern，正则校验
	if (
		pattern &&
		!(XEUtils.isRegExp(pattern) ? pattern : new RegExp(pattern)).test(val)
	) {
		return true;
	}
	return false;
};

export interface ValidateErrorParams {
	$form: LtFormConstructor;
	rule: FormRule;
	data: any;
	field: string;
}

export interface ValidateErrorMapParams {
	[field: string]: ValidateErrorParams[];
}
