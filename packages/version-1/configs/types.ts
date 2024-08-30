import { RouterOptions } from 'vue-router';
import { CacheConfig, CreateAxiosOptions } from '@lt-frame/utils';
import { LtRouteRecordRaw } from '../router/types';

interface RoutesConfig {
	// 首页的路径
	homePage?: string;
	// 追加的静态路由配置
	appendRoutes?: LtRouteRecordRaw[];
	// 动态路由
	dynamicRoutes?: LtRouteRecordRaw[];
	// 路由白名单
	whitePaths?: Array<string>;
	// 跟路径路由配置
	ROOT_ROUTE?: LtRouteRecordRaw;
	// 登录页路由配置
	LOGIN_ROUTE?: LtRouteRecordRaw;
	// 错误页路由配置
	ERROR_LOG_ROUTE?: LtRouteRecordRaw;
	// 拦截页路由配置
	REDIRECT_ROUTE?: LtRouteRecordRaw;
	// 404
	PAGE_NOT_FOUND_ROUTE?: LtRouteRecordRaw;
}

interface OtherConfig {
	// 切换路由时是否取消已发送但未响应的http请求。
	removeAllHttpPending?: boolean;
	// 切换接口时是否关闭未关闭的消息和通知弹窗
	closeMessageOnSwitch?: boolean;
}

export interface AppConfig {
	// 额外配置
	other?: OtherConfig;
	// 请求配置
	http?: CreateAxiosOptions;
	// storage的配置
	cache?: Partial<CacheConfig>;
	// 路由对象配置，初始化路由对象
	router: Partial<RouterOptions>;
	// 路由页面配置
	routes?: RoutesConfig;
	// 图标集
	svgs?: string[];
	// 业务代码中的组件信息
	componentInfoMap?: { [key: string]: any };
}
