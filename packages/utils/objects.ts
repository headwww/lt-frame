import { unref } from 'vue';
import {
	isEqual,
	mergeWith,
	unionWith,
	intersectionWith,
	cloneDeep,
	clone,
	concat,
} from 'lodash-es';
import { uniq } from 'xe-utils';
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

/**
 * 剔除数组没个对象中指定的属性,不改变内置的引用关系，返回一个新数组
 *
 * @param array
 * @param keys 需要删除的字段
 * @param option
 *
 */
export function deleteArrayProperty<T>(
	array: Array<T>,
	keys: string[] = [],
	option?: {
		// 是否深拷贝
		cloneDeep?: boolean;
		// 是否启用内置筛选的属性，删除vxetable内置的属性 默认开启
		builtIn?: boolean;
	}
): T[] {
	let arr: any = [];
	let k: string[] = [];
	if (!option?.cloneDeep) {
		arr = cloneDeep(array);
	} else {
		arr = clone(array);
	}

	if (option?.builtIn !== false) {
		k = uniq(
			concat(keys, [
				'$_checked',
				'parent.$_checked',
				'_X_ROW_CHILD',
				'parent._X_ROW_CHILD',
				'children',
				'parent.children',
				'$id',
				'parent.$id',
				'$parentId',
				'parent.$parentId',
				'_X_ROW_KEY',
				'parent._X_ROW_KEY',
			])
		);
	}

	k.forEach((key) => {
		arr.forEach((item: any) => {
			deleteObjectProperty(item, key);
		});
	});

	return arr as T[];
}

function deleteObjectProperty<T>(obj: T, keyPath: string) {
	// 将路径转换为数组，如果它已经是字符串的话
	const path = keyPath.split('.');

	// 检查路径是否有效
	if (!Array.isArray(path) || path.length === 0) {
		return; // 无效的路径，不执行任何操作
	}

	// 递归函数，用于遍历嵌套对象并找到要删除的属性
	function traverseAndDelete(obj: any, pathArr: string[]) {
		// 如果没有更多的路径段要遍历，则不执行任何操作
		if (pathArr.length === 0) {
			return;
		}

		// 获取当前路径段和剩余路径段
		const currentKey = pathArr[0];
		const remainingPath = pathArr.slice(1);

		// 检查当前对象是否有当前路径段对应的属性
		if (obj && obj.hasOwnProperty(currentKey)) {
			// 如果没有更多的路径段，则删除属性
			if (remainingPath.length === 0) {
				delete obj[currentKey];
			} else {
				// 递归遍历剩余路径段
				traverseAndDelete(obj[currentKey], remainingPath);
			}
		}
	}

	// 开始遍历并删除属性
	traverseAndDelete(obj, path);
}
