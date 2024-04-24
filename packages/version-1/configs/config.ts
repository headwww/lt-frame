import { createWebHashHistory } from 'vue-router';
import { AppConfig } from './types';
import { LAYOUT } from '../router';

/**
 * 默认配置
 */
export const defaultConfig: AppConfig = {
	other: {
		removeAllHttpPending: false,
	},
	cache: {
		appSessionCacheKey: 'LT__SESSION__KEY__',
		appLocalCacheKey: 'LT__LOCAL__KEY__',
		prefixKey: '',
		key: 'langtongkeji',
		iv: 'ltscm',
		hasEncrypt: true,
		timeout: 60 * 60 * 24 * 7,
	},
	router: {
		history: createWebHashHistory(),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	routes: {
		homePage: '/home-page',
		whitePaths: [],

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
						title: '错误日志',
						currentActiveMenu: '/error-log',
					},
				},
			],
		},
	},
};
