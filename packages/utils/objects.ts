import { unref } from 'vue';
import { isEqual, mergeWith, unionWith, intersectionWith } from 'lodash-es';
import { Recordable } from './types';
import { isArray, isObject } from './is';
/**
 * 从动态属性对象中获取部分属性值的工具函数
 * @param props 动态属性对象，包含需要获取的属性键值对
 * @returns 一个包含部分属性值的新对象
 */
export function getDynamicProps<T extends Record<string, unknown>, U>(
	props: T
): Partial<U> {
	const ret: Recordable = {};
	Object.keys(props).map((key) => {
		ret[key] = unref((props as Recordable)[key]);
	});
	return ret as Partial<U>;
}

/**
 * 递归合并两个对象。
 *
 * @param source 要合并的源对象。
 * @param target 目标对象，合并后结果存放于此。
 * @param mergeArrays 如何合并数组。默认为replace。
 *        - 对数组执行并集操作。
 *        - 对数组执行交集操作。
 *        - 连接数组。
 *        - 用目标数组替换源数组。
 * @returns 合并后的对象。
 */
export function deepMerge<
	T extends object | null | undefined,
	U extends object | null | undefined,
>(
	source: T,
	target: U,
	mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace'
): T & U {
	if (!target) {
		return source as T & U;
	}
	if (!source) {
		return target as T & U;
	}
	// 检查 source 和 target 是否是同一个对象
	if ((source as any) === target) {
		return source as T & U;
	}

	return mergeWith({}, source, target, (sourceValue, targetValue) => {
		if (isArray(targetValue) && isArray(sourceValue)) {
			switch (mergeArrays) {
				case 'union':
					return unionWith(sourceValue, targetValue, isEqual);
				case 'intersection':
					return intersectionWith(sourceValue, targetValue, isEqual);
				case 'concat':
					return sourceValue.concat(targetValue);
				case 'replace':
					return targetValue;
				default:
					throw new Error(
						`Unknown merge array strategy: ${mergeArrays as string}`
					);
			}
		}
		if (isObject(targetValue) && isObject(sourceValue)) {
			return deepMerge(sourceValue, targetValue, mergeArrays);
		}
		return undefined;
	});
}

/**
 * 将一个普通的数据包装() =>Promise
 * @param data
 * @returns 转换后的对象
 */
export function wrapDataInPromise(data: any | any[]) {
	return () =>
		new Promise((resolve, reject) => {
			try {
				resolve(data);
			} catch (error) {
				reject(error);
			}
		});
}
