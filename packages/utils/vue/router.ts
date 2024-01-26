import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

/**
 * 获取原始路由对象的工具函数
 * @param route 处理前的路由对象
 * @returns 去除部分属性的新路由对象，保留 meta、name 和 path 属性，并重新构建 matched 数组
 */
export function getRawRoute(
	route: RouteLocationNormalized
): RouteLocationNormalized {
	if (!route) return route;
	const { matched, ...opt } = route;
	const newMatched = matched
		? matched.map((item) => ({
				meta: item.meta,
				name: item.name,
				path: item.path,
			}))
		: undefined;
	return {
		...opt,
		matched: newMatched as RouteRecordNormalized[],
	};
}
