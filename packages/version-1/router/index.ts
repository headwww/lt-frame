import { getGlobalRouter } from '../configs';

/**
 * 重置路由器的路由配置
 * @param router 路由表
 * @param addWhiteRouter 添加不需要删除的静态路由
 */
export function resetRouter(addWhiteRouter: string[]) {
	getGlobalRouter()
		.getRoutes()
		.forEach((route) => {
			const { name } = route;
			if (name && addWhiteRouter.includes(name as string)) {
				getGlobalRouter().hasRoute(name) && getGlobalRouter().removeRoute(name);
			}
		});
}
