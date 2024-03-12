import { RouterOptions } from 'vue-router';
import { CacheConfig, CreateAxiosOptions } from '@lt-frame/utils';
import { LTRouteRecordRaw } from '../router/types';

export interface AppConfigV1 {
	// 创建路由器的行为和功能
	routerConfig: Partial<RouterOptions>;
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
	// 定义重定向路由的name，默认为Redirect和basicRoutes.REDIRECT_ROUTE配置的一样，如果重新定义了basicRoutes.REDIRECT_ROUTE那么redirectName需要同步更改
	redirectName?: string;
	// 新增静态路由
	addRoutes?: LTRouteRecordRaw[];
	// 切换路由时是否取消已发送但未响应的http请求。
	removeAllHttpPending?: boolean;
	// 切换接口时是否关闭未关闭的消息和通知弹窗
	closeMessageOnSwitch?: boolean;
	// 自定义HTTP请求的实例
	httpConfig?: CreateAxiosOptions;
	// 缓存配置
	cacheConfig?: Partial<CacheConfig>;
}
