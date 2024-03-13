import { defineStore } from 'pinia';
import { cloneDeep } from 'lodash-es';
import { filter } from '@lt-frame/utils';
import { LTRouteRecordRaw } from '../router';
import { flatMultiLevelRoutes } from '../router/helper/routeHelper';
import { getAppConfig } from '../configs';
import { Menu } from '../types';
import { transformRouteToMenu } from '../router/helper/menuHelper';

export interface PermissionState {
	// 路由是否动态添加
	isDynamicAddedRoute: boolean;
	// 菜单列表
	menuList: Menu[];
}

export const usePermissionStore = defineStore({
	id: 'lt-permission',
	state: (): PermissionState => ({
		// 路由是否动态添加
		isDynamicAddedRoute: false,
		// 菜单列表
		menuList: [],
	}),
	getters: {
		getDynamicAddedRoute(state): boolean {
			return state.isDynamicAddedRoute;
		},
		getMenuList(state): Menu[] {
			return state.menuList;
		},
	},
	actions: {
		setDynamicAddedRoute(b: boolean) {
			this.isDynamicAddedRoute = b;
		},
		setMenuList(list: Menu[]) {
			this.menuList = list;
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

			// 将路由转换成菜单
			const menuList = transformRouteToMenu(routes);
			// 移除掉 ignoreRoute: true 的路由 非一级路由
			routes = filter(routes, routeRemoveIgnoreFilter);
			// 移除掉 ignoreRoute: true 的路由 一级路由；
			routes = routes.filter(routeRemoveIgnoreFilter);
			// 对菜单进行排序
			menuList.sort((a, b) => (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0));
			// // 设置菜单列表
			this.setMenuList(menuList);
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
