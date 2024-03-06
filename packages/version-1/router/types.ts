import { defineComponent } from 'vue';
import { RouteRecordRaw } from 'vue-router';

export type Component<T = any> =
	| ReturnType<typeof defineComponent>
	| (() => Promise<typeof import('*.vue')>)
	| (() => Promise<T>);

// @ts-ignore
export interface LTRouteRecordRaw extends Omit<RouteRecordRaw, 'meta'> {
	name: string; // 路由名称
	meta: RouteMeta; // 路由元信息
	component?: Component | string; // 路由组件
	components?: Component; // 带有命名视图的路由组件
	children?: LTRouteRecordRaw[]; // 子路由配置
	props?: Record<string, any>; // 路由组件的 props
	fullPath?: string; // 完整的路由路径
}

export interface RouteMeta extends Record<string | number | symbol, unknown> {
	// 路由的排序号，可用于控制菜单项的排序
	orderNo?: number;
	// 路由标题，通常用于显示在菜单或标签页中
	title: string;
	// 是否忽略登录检查，用于主框架之外的页面
	ignoreAuth?: boolean;
	// 是否忽略缓存
	ignoreKeepAlive?: boolean;
	// 是否固定在标签页上
	affix?: boolean;
	// 图标
	icon?: string;
	// 是否隐藏子菜单
	hideChildrenInMenu?: boolean;
	// 是否不显示在菜单中
	hideMenu?: boolean;
	// 仅用于菜单构建，不生成路由
	ignoreRoute?: boolean;
	// 是否在子级菜单的完整path中忽略本级path
	hidePathForChildren?: boolean;
	// 是否不显示在标签页上
	hideTab?: boolean;
	// 标签页上显示的外部网页地址
	frameSrc?: string;
	//  动态路由可打开Tab页数
	// dynamicLevel?: number;
	// 是否是外部链接
	// isLink?: boolean;
	// 当前页面的过渡动画名称
	// transitionName?: string;
	// 动态路由的真实路径（用于性能优化）
	// realPath?: string;
	// 角色信息，用于权限控制
	// roles?: RoleEnum[];
	// 是否携带路由参数
	// carryParam?: boolean;
	// 用于标记单级菜单
	// single?: boolean;
	// 当前活动的菜单项
	// currentActiveMenu?: string;
	// 路由是否已动态添加
	// hideBreadcrumb?: boolean;
}
