import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { filter } from '@lt-frame/utils';
import { LTRouteRecordRaw } from '../router';
import { flatMultiLevelRoutes } from '../router/helper/routeHelper';
import { getAppConfig } from '../configs';

export const usePermissionStore = defineStore({
	id: 'lt-permission',
	state: () => ({
		isDynamicAddedRoute: false,
	}),
	getters: {
		getDynamicAddedRoute(state): boolean {
			return state.isDynamicAddedRoute;
		},
	},
	actions: {
		setDynamicAddedRoute(b: boolean) {
			this.isDynamicAddedRoute = b;
		},
		async buildRoutesAction(
			asyncRoutes: LTRouteRecordRaw[] = []
		): Promise<LTRouteRecordRaw[]> {
			const routeRemoveIgnoreFilter = (route: LTRouteRecordRaw) => {
				const { meta } = route;
				// ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
				const { ignoreRoute } = meta || {};
				// arr.filter 返回 true 表示该元素通过测试
				return !ignoreRoute;
			};
			let routes: LTRouteRecordRaw[] = cloneDeep(asyncRoutes);
			// 移除掉 ignoreRoute: true 的路由 非一级路由
			routes = filter(routes, routeRemoveIgnoreFilter);
			// 移除掉 ignoreRoute: true 的路由 一级路由；
			routes = routes.filter(routeRemoveIgnoreFilter);
			// 将多级路由转换成2级路由
			routes = flatMultiLevelRoutes(routes);
			// 将日志路由添加进去
			routes.push(getAppConfig().basicRoutes?.ERROR_LOG_ROUTE!!);
			return routes;
		},
		resetState(): void {
			this.isDynamicAddedRoute = false;
		},
	},
});
