import {
	RouteRecordRaw,
	Router,
	RouterOptions,
	createRouter,
	createWebHashHistory,
} from 'vue-router';
import { deepMerge } from '@lt-frame/utils';
import { AppConfigV1 } from './types';
import { LTRouteRecordRaw } from '../router/types';

let config: AppConfigV1 = {
	routerOptions: {
		history: createWebHashHistory(),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	basicRoutes: {
		ROOT_ROUTE: {
			path: '/',
			name: 'Root',
			redirect: '/home-page',
			meta: {
				title: 'Root',
			},
		},
		LOGIN_ROUTE: {
			path: '/login',
			name: 'Login',
			// component: () => import('../view/error/index.vue'),
			component: () => import('../view/login/index.vue'),
			meta: {
				title: '登录',
			},
		},
		PAGE_NOT_FOUND_ROUTE: {
			path: '/:path(.*)*',
			name: 'ParentLayout',
			component: () => import('../layout/default/index.vue'),
			meta: {
				title: 'ErrorPage',
				hideMenu: true,
			},
			children: [
				{
					path: '/:path(.*)*',
					name: 'PageNotFound',
					component: () => import('../view/error/index.vue'),
					meta: {
						title: 'ErrorPage',
						hideMenu: true,
					},
				},
			],
		},
	},
};

let router: Router;

let basicRoutes: LTRouteRecordRaw[];

export function defineConfig_v1(options: AppConfigV1) {
	config = deepMerge(config, options);
	const { routerOptions } = config;

	// 创建路由相关的信息
	basicRoutes = [
		config.basicRoutes?.LOGIN_ROUTE!!,
		config.basicRoutes?.ROOT_ROUTE!!,
		config.basicRoutes?.PAGE_NOT_FOUND_ROUTE!!,
	];
	if (config.addRoutes) {
		basicRoutes = basicRoutes.concat(config.addRoutes);
	}

	const opt: RouterOptions = {
		history: routerOptions.history!!,
		routes: basicRoutes as unknown as RouteRecordRaw[],
		scrollBehavior: routerOptions.scrollBehavior,
		parseQuery: routerOptions.parseQuery,
		stringifyQuery: routerOptions.stringifyQuery,
		linkActiveClass: routerOptions.linkActiveClass,
		linkExactActiveClass: routerOptions.linkExactActiveClass,
	};
	router = createRouter(opt);

	return { config, router };
}

/**
 * 获取所有的静态路由配置
 */
export function getBasicRoutes() {
	return basicRoutes;
}

/**
 * 获取创建的router实例
 *
 * @returns
 */
export function getGlobalRouter() {
	return router;
}

export function getConfig(): AppConfigV1 {
	return config;
}
