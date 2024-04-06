import { cloneDeep, omit } from 'lodash-es';
import {
	RouteRecordNormalized,
	Router,
	createRouter,
	createWebHashHistory,
} from 'vue-router';
import { LtRouteRecordRaw } from '../types';

export function flatMultiLevelRoutes(routeModules: LtRouteRecordRaw[]) {
	const modules: LtRouteRecordRaw[] = cloneDeep(routeModules);
	for (let index = 0; index < modules.length; index += 1) {
		const routeModule = modules[index];
		// 判断级别是否多级路由
		if (isMultipleRoute(routeModule)) {
			// 路由等级提升
			promoteRouteLevel(routeModule);
		}
	}
	return modules;
}

/**
 * 路由等级提升
 */

function promoteRouteLevel(routeModule: LtRouteRecordRaw) {
	// Use vue-router to splice menus
	// 使用vue-router拼接菜单
	// createRouter 创建一个可以被 Vue 应用程序使用的路由实例
	let router: Router | null = createRouter({
		routes: [routeModule as unknown as RouteRecordNormalized],
		history: createWebHashHistory(),
	});
	// getRoutes： 获取所有 路由记录的完整列表。
	const routes = router.getRoutes();
	// 将所有子路由添加到二级路由
	addToChildren(routes, routeModule.children || [], routeModule);
	router = null;

	// omit lodash的函数 对传入的item对象的children进行删除
	routeModule.children = routeModule.children?.map((item) =>
		omit(item, 'children')
	);
}

/**
 * 将所有子路由添加到二级路由
 * @param routes
 * @param children
 * @param routeModule
 */
function addToChildren(
	routes: RouteRecordNormalized[],
	children: LtRouteRecordRaw[],
	routeModule: LtRouteRecordRaw
) {
	for (let index = 0; index < children.length; index += 1) {
		const child = children[index];
		const route = routes.find((item) => item.name === child.name);
		if (route) {
			routeModule.children = routeModule.children || [];
			if (!routeModule.children.find((item) => item.name === route.name)) {
				routeModule.children?.push(route as unknown as LtRouteRecordRaw);
			}
			if (child.children?.length) {
				addToChildren(routes, child.children, routeModule);
			}
		}
	}
}
/**
 * 判断级别是否超过2级
 */
function isMultipleRoute(routeModule: LtRouteRecordRaw) {
	// Reflect.has 与 in 操作符 相同, 用于检查一个对象(包括它原型链上)是否拥有某个属性
	if (
		!routeModule ||
		!Reflect.has(routeModule, 'children') ||
		!routeModule.children?.length
	) {
		return false;
	}
	const { children } = routeModule;

	let flag = false;
	for (let index = 0; index < children.length; index += 1) {
		const child = children[index];
		if (child.children?.length) {
			flag = true;
			break;
		}
	}
	return flag;
}
