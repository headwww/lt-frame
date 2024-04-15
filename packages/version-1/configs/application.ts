import { LTAxios, deepMerge, defineCache } from '@lt-frame/utils';
import { RouteRecordRaw, Router, createRouter } from 'vue-router';
import { createPinia } from 'pinia';
import defineHttp from './http';
import { AppConfig } from './types';
import { defaultConfig } from './config';
import { LtRouteRecordRaw } from '../router';

let deepMergeConfigs: AppConfig;

let http: LTAxios | undefined;

let router: Router | undefined;

let mBasicRoutes: LtRouteRecordRaw[] = [];

const mWhitePathList: string[] = [];

export function defineConfig(configs: AppConfig) {
	deepMergeConfigs = deepMerge(defaultConfig, configs);

	const {
		http: httpConfig,
		cache,
		router: routerConfig,
		routes,
	} = deepMergeConfigs;

	// 初始化storege
	defineCache(cache);

	// 初始化Axios
	http = defineHttp(httpConfig);

	// 初始化路由
	if (routes) {
		const {
			ROOT_ROUTE,
			PAGE_NOT_FOUND_ROUTE,
			REDIRECT_ROUTE,
			LOGIN_ROUTE,
			whitePaths,
			appendRoutes,
		} = routes;

		if (LOGIN_ROUTE) {
			mBasicRoutes.push(LOGIN_ROUTE);
			// 默认将登录添加路由白名单
			mWhitePathList.push(LOGIN_ROUTE.path);
		}
		// 将外部的路由白名单合并到一起
		if (whitePaths) {
			if (whitePaths.length > 0) mWhitePathList.push(...whitePaths);
		}
		if (ROOT_ROUTE) mBasicRoutes.push(ROOT_ROUTE);
		if (REDIRECT_ROUTE) mBasicRoutes.push(REDIRECT_ROUTE);
		if (PAGE_NOT_FOUND_ROUTE) mBasicRoutes.push(PAGE_NOT_FOUND_ROUTE);
		// 追加的路由
		if (appendRoutes) {
			mBasicRoutes = mBasicRoutes.concat(appendRoutes);
		}
	}

	router = createRouter({
		...routerConfig,
		history: routerConfig.history!!,
		routes: mBasicRoutes as unknown as RouteRecordRaw[],
	});
}

defineConfig({
	router: {
		routes: [],
	},
});

/** Axios */
export const LtHttp = http as LTAxios;

/** router */
export const LtRouter = router as Router;

/** pinia */
export const LtPinia = createPinia();

/** 配置 */
export function getAppConfig(): AppConfig {
	return deepMergeConfigs;
}

/**
 * 获取所有的静态路由配置
 */
export function getBasicRoutes() {
	return mBasicRoutes;
}

/**
 * 获取路由白名单
 */
export function getWhitePaths(): string[] {
	return mWhitePathList;
}
