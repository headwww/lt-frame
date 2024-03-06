import { RouterOptions } from 'vue-router';
import { LTRouteRecordRaw } from '../router/types';

export interface AppConfigV1 {
	// 创建路由器的行为和功能
	routerOptions: Partial<RouterOptions>;
	// 内置的静态路由
	basicRoutes?: {
		ROOT_ROUTE?: LTRouteRecordRaw;
		LOGIN_ROUTE?: LTRouteRecordRaw;
		ERROR_LOG_ROUTE?: LTRouteRecordRaw;
		REDIRECT_ROUTE?: LTRouteRecordRaw;
		PAGE_NOT_FOUND_ROUTE?: LTRouteRecordRaw;
	};
	// 新增静态路由
	addRoutes?: LTRouteRecordRaw[];
}
