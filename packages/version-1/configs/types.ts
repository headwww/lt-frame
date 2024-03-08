import { RouterOptions } from 'vue-router';
import { LTRouteRecordRaw } from '../router/types';

export interface AppConfigV1 {
	// 创建路由器的行为和功能
	routerOptions: Partial<RouterOptions>;
	// 首页
	homePage?: string;
	// 动态路由
	dynamicRoutes?: LTRouteRecordRaw[];
	// 路由白名单
	whitePathList?: string[];
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
	// 切换路由时是否取消已发送但未响应的http请求。
	removeAllHttpPending?: boolean;
	//	// 切换接口时是否关闭未关闭的消息和通知弹窗
	closeMessageOnSwitch?: boolean;
}
