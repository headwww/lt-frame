import { isNil } from 'lodash-es';

// 用于对象类型判断的 toString 方法
const { toString } = Object.prototype;

/**
 * 检查值是否是字符串类型并可转为数字
 * @param val 待检查的字符串
 * @returns 如果值是字符串并可转为数字，则返回 true，否则返回 false
 */
export const isStringNumber = (val: string): boolean => {
	// 判断是否为字符串
	if (!isString(val)) {
		return false;
	}
	// 判断是否可以转为数字
	return !Number.isNaN(Number(val));
};

/**
 * 检查值是否为指定类型
 * @param val 待检查的值
 * @param type 指定的类型字符串
 * @returns 如果值为指定类型，则返回 true，否则返回 false
 */
export function is(val: unknown, type: string) {
	return toString.call(val) === `[object ${type}]`;
}

/**
 * 检查值是否已定义
 * @param val 待检查的值
 * @returns 如果值已定义，则返回 true，否则返回 false
 */
export function isDef<T = unknown>(val?: T): val is T {
	return typeof val !== 'undefined';
}

/**
 * 检查值是否未定义
 * @param val 待检查的值
 * @returns 如果值未定义，则返回 true，否则返回 false
 */
export function isUnDef<T = unknown>(val?: T): val is T {
	return !isDef(val);
}

/**
 * 检查值是否为对象
 * @param val 待检查的值
 * @returns 如果值为对象，则返回 true，否则返回 false
 */
export function isObject(val: any): val is Record<any, any> {
	return val !== null && is(val, 'Object');
}

/**
 * 检查值是否非空
 * @param val 待检查的值
 * @returns 如果值非空，则返回 true，否则返回 false
 */
export function isNotEmpty(val: any): boolean {
	return !isNil(val) && !isEmpty(val);
}

/**
 * 检查值是否为空
 * @param val 待检查的值
 * @returns 如果值为空，则返回 true，否则返回 false
 */
export function isEmpty<T = unknown>(val: T): val is T {
	// 判断是否为 null 或 undefined
	if (isNil(val)) {
		return true;
	}

	// 判断是否为数组或字符串
	if (isArray(val) || isString(val)) {
		return val.length === 0;
	}

	// 判断是否为 Map 或 Set
	if (val instanceof Map || val instanceof Set) {
		return val.size === 0;
	}

	// 判断是否为普通对象
	if (isObject(val)) {
		return Object.keys(val).length === 0;
	}

	return false;
}

/**
 * 检查值是否为日期类型
 * @param val 待检查的值
 * @returns 如果值为日期类型，则返回 true，否则返回 false
 */
export function isDate(val: unknown): val is Date {
	return is(val, 'Date');
}

/**
 * 检查值是否为 null
 * @param val 待检查的值
 * @returns 如果值为 null，则返回 true，否则返回 false
 */
export function isNull(val: unknown): val is null {
	return val === null;
}

/**
 * 检查值是否为 null 或 undefined
 * @param val 待检查的值
 * @returns 如果值为 null 或 undefined，则返回 true，否则返回 false
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) && isNull(val);
}

/**
 * 检查值是否为 null 或 undefined
 * @param val 待检查的值
 * @returns 如果值为 null 或 undefined，则返回 true，否则返回 false
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
	return isUnDef(val) || isNull(val);
}

/**
 * 检查值是否为数字类型
 * @param val 待检查的值
 * @returns 如果值为数字类型，则返回 true，否则返回 false
 */
export function isNumber(val: unknown): val is number {
	return is(val, 'Number');
}

/**
 * 检查值是否为 Promise 类型
 * @param val 待检查的值
 * @returns 如果值为 Promise 类型，则返回 true，否则返回 false
 */
export function isPromise<T = any>(val: unknown): val is Promise<T> {
	return (
		is(val, 'Promise') &&
		isObject(val) &&
		isFunction(val.then) &&
		isFunction(val.catch)
	);
}

/**
 * 检查值是否为函数类型
 * @param val 待检查的值
 * @returns 如果值为函数类型，则返回 true，否则返回 false
 */
export function isFunction(val: unknown): val is Function {
	return typeof val === 'function';
}

/**
 * 检查值是否为布尔类型
 * @param val 待检查的值
 * @returns 如果值为布尔类型，则返回 true，否则返回 false
 */
export function isBoolean(val: unknown): val is boolean {
	return is(val, 'Boolean');
}

/**
 * 检查值是否为正则表达式类型
 * @param val 待检查的值
 * @returns 如果值为正则表达式类型，则返回 true，否则返回 false
 */
export function isRegExp(val: unknown): val is RegExp {
	return is(val, 'RegExp');
}

/**
 * 检查值是否为数组类型
 * @param val 待检查的值
 * @returns 如果值为数组类型，则返回 true，否则返回 false
 */
export function isArray(val: any): val is Array<any> {
	return val && Array.isArray(val);
}

/**
 * 检查值是否为 Window 对象
 * @param val 待检查的值
 * @returns 如果值为 Window 对象，则返回 true，否则返回 false
 */
export function isWindow(val: any): val is Window {
	return typeof window !== 'undefined' && is(val, 'Window');
}

/**
 * 检查值是否为 DOM 元素
 * @param val 待检查的值
 * @returns 如果值为 DOM 元素，则返回 true，否则返回 false
 */
export function isElement(val: unknown): val is Element {
	return isObject(val) && !!val.tagName;
}

/**
 * 检查值是否为 Map 类型
 * @param val 待检查的值
 * @returns 如果值为 Map 类型，则返回 true，否则返回 false
 */
export function isMap(val: unknown): val is Map<any, any> {
	return is(val, 'Map');
}

// 服务器端检测
export const isServer = typeof window === 'undefined';

// 客户端检测
export const isClient = !isServer;

/**
 * 检查字符串是否为 URL
 * @param path 待检查的字符串
 * @returns 如果字符串是 URL，则返回 true，否则返回 false
 */
export function isUrl(path: string): boolean {
	const reg = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/;
	return reg.test(path);
}

/**
 * 检查值是否为字符串类型
 * @param val 待检查的值
 * @returns 如果值为字符串类型，则返回 true，否则返回 false
 */
export function isString(val: unknown): val is string {
	return is(val, 'String');
}
