import {
	RouteRecordRaw,
	Router,
	RouterOptions,
	createRouter,
	createWebHashHistory,
} from 'vue-router';
import { deepMerge, defineCache, defineHttp } from '@lt-frame/utils';
import { createPinia } from 'pinia';
import { AppConfigV1 } from './types';
import { LTRouteRecordRaw } from '../router/types';
import { LAYOUT } from '../router';

let config: AppConfigV1 = {
	routerConfig: {
		history: createWebHashHistory(),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	homePage: '/home-page',
	whitePathList: [],
	removeAllHttpPending: false,
	redirectName: 'Redirect',
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
			component: () => import('../view/login/index.vue'),
			meta: {
				title: '登录',
			},
		},
		PAGE_NOT_FOUND_ROUTE: {
			path: '/:path(.*)*',
			name: 'PageNotFound',
			component: LAYOUT,
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
		REDIRECT_ROUTE: {
			path: '/redirect',
			component: LAYOUT,
			name: 'RedirectTo',
			meta: {
				title: 'Redirect',
				hideMenu: true,
			},
			children: [
				{
					path: '/redirect/:path(.*)/:_redirect_type(.*)/:_origin_params(.*)?',
					name: 'Redirect',
					component: () => import('../view/redirect/index.vue'),
					meta: {
						title: 'Redirect',
					},
				},
			],
		},
		ERROR_LOG_ROUTE: {
			path: '/error-log',
			name: 'ErrorLog',
			component: LAYOUT,
			redirect: '/error-log/list',
			meta: {
				title: 'ErrorLog',
				hideChildrenInMenu: true,
			},
			children: [
				{
					path: 'list',
					name: 'ErrorLogList',
					component: () => import('../view/log/index.vue'),
					meta: {
						title: '日志列表',
						currentActiveMenu: '/error-log',
					},
				},
			],
		},
	},
};

let router: Router;

let mBasicRoutes: LTRouteRecordRaw[] = [];

const mWhitePathList: string[] = [];

const pinia = createPinia();

export function defineConfig_v1(options: AppConfigV1) {
	config = deepMerge(config, options);
	const {
		routerConfig,
		basicRoutes,
		addRoutes,
		whitePathList,
		httpConfig,
		cacheConfig,
	} = config;

	defineCache(cacheConfig);

	// 创建路由相关的信息
	// 合并路由白名单
	if (basicRoutes) {
		const { LOGIN_ROUTE, ROOT_ROUTE, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } =
			basicRoutes;

		if (LOGIN_ROUTE) {
			mBasicRoutes.push(LOGIN_ROUTE);
			// 默认将登录添加路由白名单
			mWhitePathList.push(LOGIN_ROUTE.path);
		}
		// 将外部的路由白名单合并到一起
		if (whitePathList) {
			if (whitePathList.length > 0) mWhitePathList.push(...whitePathList);
		}
		if (ROOT_ROUTE) mBasicRoutes.push(ROOT_ROUTE);
		if (REDIRECT_ROUTE) mBasicRoutes.push(REDIRECT_ROUTE);
		if (PAGE_NOT_FOUND_ROUTE) mBasicRoutes.push(PAGE_NOT_FOUND_ROUTE);
	}

	if (addRoutes) {
		mBasicRoutes = mBasicRoutes.concat(addRoutes);
	}

	const opt: RouterOptions = {
		history: routerConfig.history!!,
		routes: mBasicRoutes as unknown as RouteRecordRaw[],
		scrollBehavior: routerConfig.scrollBehavior,
		parseQuery: routerConfig.parseQuery,
		stringifyQuery: routerConfig.stringifyQuery,
		linkActiveClass: routerConfig.linkActiveClass,
		linkExactActiveClass: routerConfig.linkExactActiveClass,
	};

	router = createRouter(opt);

	const LTHttp = defineHttp(httpConfig);

	return { config, router, pinia, LTHttp };
}

/**
 * 获取所有的静态路由配置
 */
export function getBasicRoutes() {
	return mBasicRoutes;
}

/**
 * 获取创建的router实例
 *
 */
export function getGlobalRouter() {
	return router;
}

/**
 * 初始化配置
 */
export function getAppConfig(): AppConfigV1 {
	return config;
}

/**
 * 获取路由白名单
 */
export function getWhitePathList(): string[] {
	return mWhitePathList;
}
