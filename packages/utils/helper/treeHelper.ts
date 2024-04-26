import { Fn } from '../types';

/**
 * 提取树指定结构
 * @param treeData
 * @param opt
 * @returns
 */
export function treeMap<T = any>(
	treeData: T[],
	opt: { children?: string; conversion: Fn }
): T[] {
	return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * 提取树指定结构
 * @param data
 * @param param1
 * @returns
 */
export function treeMapEach(
	data: any,
	{ children = 'children', conversion }: { children?: string; conversion: Fn }
) {
	// 是否还有子节点
	const haveChildren =
		Array.isArray(data[children]) && data[children].length > 0;
	// 用传递进来的函数处理数据
	const conversionData = conversion(data) || {};
	// 如果有子节点继续处理
	if (haveChildren) {
		return {
			...conversionData,
			[children]: data[children].map((i: number) =>
				treeMapEach(i, {
					children,
					conversion,
				})
			),
		};
	}
	return {
		...conversionData,
	};
}

interface TreeHelperConfig {
	id: string;
	children: string;
	pid: string;
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: TreeHelperConfig = {
	id: 'id',
	children: 'children',
	pid: 'pid',
};
// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) => ({
	...DEFAULT_CONFIG,
	...config,
});

/**
 * 过滤树结构
 * @param tree
 * @param func
 * @param config
 * @returns
 */
export function filter<T = any>(
	tree: T[],
	func: (n: T) => boolean,
	// Partial 将 T 中的所有属性设为可选
	config: Partial<TreeHelperConfig> = {}
): T[] {
	// 获取配置
	config = getConfig(config);
	const children = config.children as string;
	function listFilter(list: T[]) {
		return list
			.map((node: any) => ({ ...node }))
			.filter((node) => {
				// 递归调用 对含有children项  进行再次调用自身函数 listFilter
				node[children] = node[children] && listFilter(node[children]);
				// 执行传入的回调 func 进行过滤
				return func(node) || (node[children] && node[children].length);
			});
	}
	return listFilter(tree);
}
/**
 * 导出一个名为 findPath 的函数，用于在树形数据结构中查找满足条件的路径
 * @param tree  要搜索的树形数据结构
 * @param func 搜索条件的回调函数，用于确定路径中的每个节点是否符合条件
 * @param config 用于配置树的结构的选项，可以传递一些树的配置信息
 * @returns
 */
export function findPath<T = any>(
	tree: any,
	func: Fn,
	config: Partial<TreeHelperConfig> = {}
): T | T[] | null {
	// 从配置中获取树的配置信息
	config = getConfig(config);
	// 用于存储路径的数组
	const path: T[] = [];
	// 待处理的节点列表，初始化为树的根节点
	const list = [...tree];
	// 用于跟踪已访问的节点，以避免循环引用
	const visitedSet = new Set();
	// 从配置中获取子节点的字段名称
	const { children } = config;
	// 循环处理节点列表，直到列表为空
	while (list.length) {
		// 获取列表中的第一个节点
		const node = list[0];
		// 如果节点已经被访问过，则从路径中移除，并从列表中移除
		if (visitedSet.has(node)) {
			path.pop();
			list.shift();
		} else {
			// 将节点标记为已访问
			visitedSet.add(node);
			// 如果节点有子节点，将子节点添加到列表的前面，以便后续处理
			node[children!] && list.unshift(...node[children!]);
			// 将节点添加到路径中
			path.push(node);
			// 如果节点满足搜索条件（由 func 函数定义），则返回路径
			if (func(node)) {
				return path;
			}
		}
	}
	// 如果没有找到满足条件的路径，返回 null
	return null;
}

export function treeToList<T = any>(
	tree: any,
	config: Partial<TreeHelperConfig> = {}
): T {
	config = getConfig(config);
	const { children } = config;
	const result: any = [...tree];
	for (let i = 0; i < result.length; i++) {
		if (!result[i][children!]) continue;
		result.splice(i + 1, 0, ...result[i][children!]);
	}
	return result;
}
