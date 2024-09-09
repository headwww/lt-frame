import { RouteMeta } from './router';

export interface Menu {
	orderNo?: number; // 菜单项排序号
	name: string; // 菜单名称
	icon?: string; // 菜单图标
	path: string; // 菜单路径
	paramPath?: string; // 带有参数的菜单路径
	disabled?: boolean; // 是否禁用
	children?: Menu[]; // 子菜单
	meta?: Partial<RouteMeta>; // 菜单项元信息
	hideMenu?: boolean; // 是否隐藏菜单
}

export interface MenuSetting {
	// 菜单收起状态
	collapsed: boolean;
	// 当前展开的 SubMenu 菜单项 key 数组
	openKeys: Array<string>;
}

export interface ProjectConfig {
	menuSetting: MenuSetting;
}

export interface FeatureConfig {
	// 类型，应用组/应用/链接
	type?: 'group' | 'feature' | 'link';
	// id
	fid?: number | string;
	// 父类id
	parentId?: number | string;
	// 访问路径
	path?: string;
	// 组件
	component?: string;
	// 组件名称
	name?: string;
	// 图标
	icon?: string;
	// 显示标题
	title?: string;
	// 第三方链接地址http/https
	frameSrc?: string;
	// 是否外部打开第三方链接
	isExternalLink?: boolean;
	// 排序
	orderNo?: number;
	// 非新创建的是服务端返回的
	notNewly?: boolean;

	children?: FeatureConfig[];
}

export interface FeatureRow {
	component?: string;
	name?: string;
	title?: string;
	introduce?: string;
	version?: string;
}
