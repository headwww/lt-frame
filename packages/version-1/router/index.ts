import { getBasicRoutes, getGlobalRouter } from '../configs';

/**
 * 重置路由器的路由配置
 * @param router 路由表
 */
export function resetRouter() {
	const WHITE_NAME_LIST: string[] = [];
	const getRouteNames = (array: any[]) =>
		array.forEach((item) => {
			WHITE_NAME_LIST.push(item.name);
			getRouteNames(item.children || []);
		});
	getRouteNames(getBasicRoutes());

	getGlobalRouter()
		.getRoutes()
		.forEach((route) => {
			const { name } = route;
			if (name && WHITE_NAME_LIST.includes(name as string)) {
				getGlobalRouter().hasRoute(name) && getGlobalRouter().removeRoute(name);
			}
		});
}
export * from './types';
export * from './constant';
export * from './guard';
