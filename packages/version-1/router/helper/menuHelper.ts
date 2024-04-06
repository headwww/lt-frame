import { findPath, isUrl, treeMap } from '@lt-frame/utils';
import { cloneDeep } from 'lodash-es';
import { Menu } from '../../types';
import { LtRouteRecordRaw } from '../types';

export function getAllParentPath<T>(treeData: T[], path: string) {
	const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
	return (menuList || []).map((item) => item.path);
}

export function transformRouteToMenu(routes: LtRouteRecordRaw[]) {
	const cloneRoute = cloneDeep(routes);
	const routeList: LtRouteRecordRaw[] = [];
	// 将标注了hideChildrenInMenu的路由的redirect添加到path上
	cloneRoute.forEach((item) => {
		if (item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
			item.path = item.redirect;
		}
		routeList.push(item);
	});

	// 将路由的树结构转换为菜单的树结构
	const list = treeMap(routeList, {
		conversion: (node: LtRouteRecordRaw) => {
			const { meta: { title, hideMenu = false } = {} } = node;
			return {
				...(node.meta || {}),
				meta: node.meta,
				name: title,
				hideMenu,
				path: node.path,
				...(node.redirect ? { redirect: node.redirect } : {}),
			};
		},
	});
	joinParentPath(list);
	return cloneDeep(list);
}

/**
 * 路径处理，将路由内的地址转变为全路径，方便在menu中调用
 * @param menus
 * @param parentPath
 */
function joinParentPath(menus: Menu[], parentPath = '') {
	menus.forEach((item) => {
		// 以 / 开头的嵌套路径将被视为根路径。
		// 这允许你利用组件嵌套，而无需使用嵌套 URL。
		if (!(item.path.startsWith('/') || isUrl(item.path))) {
			// 路径不以 / 开头，也不是 url，加入父路径
			item.path = `${parentPath}/${item.path}`;
		}
		if (item?.children?.length) {
			joinParentPath(
				item.children,
				item.meta?.hidePathForChildren ? parentPath : item.path
			);
		}
	});
}
