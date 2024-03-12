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
