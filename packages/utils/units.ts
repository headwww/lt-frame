import { isNumber, isStringNumber, isString } from './is';
/**
 * 为数值或字符串添加默认单位的工具函数
 * @param value 要处理的值，可以是数字、字符串或字符串形式的数字
 * @param defaultUnit 默认的单位（若未提供单位时使用），默认为 'px'
 * @returns 处理后的带有单位的字符串，若输入值为数字或字符串形式的数字，将其添加上默认单位；若为字符串，保持不变；若值未提供或为非法值，返回空字符串
 */
export function addUnit(value?: string | number, defaultUnit = 'px') {
	if (!value) return '';
	if (isNumber(value) || isStringNumber(value)) {
		return `${value}${defaultUnit}`;
	}
	if (isString(value)) {
		return value;
	}
	return '';
}
