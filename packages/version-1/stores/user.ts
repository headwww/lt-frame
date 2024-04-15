import { Persistent } from '@lt-frame/utils';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { useMessage } from '@lt-frame/hooks';
import { h } from 'vue';
import { LtHttp, LtRouter, getAppConfig } from '../configs';
import { usePermissionStore } from './permission';

export const useUserStore = defineStore({
	id: 'lt-user',
	state: () => ({
		userInfo: null,
	}),
	getters: {
		getUserInfo(state): any {
			state.userInfo = Persistent.getLocal('USER_INFO');
			return state.userInfo;
		},
	},
	actions: {
		setUserInfo(info: any) {
			this.userInfo = info;
			Persistent.setLocal('USER_INFO', this.userInfo, true);
		},
		async login(username: string, password: string) {
			try {
				const data = await LtHttp.post(
					{ url: 'api/login', data: [username, password] },
					{ errorMessageMode: 'modal' }
				);
				this.setUserInfo({ ...data, password });
				this.afterLoginAction();
				return data;
			} catch (error) {
				return Promise.reject(error);
			}
		},
		async afterLoginAction() {
			// 动态添加路由
			const permissionStore = usePermissionStore();
			if (!permissionStore.isDynamicAddedRoute) {
				const { routes: routesConfig } = getAppConfig();
				if (routesConfig) {
					const { dynamicRoutes, PAGE_NOT_FOUND_ROUTE } = routesConfig;
					if (dynamicRoutes) {
						const routes =
							await permissionStore.buildRoutesAction(dynamicRoutes);
						routes.forEach((route) => {
							LtRouter.addRoute(route as unknown as RouteRecordRaw);
						});
						if (PAGE_NOT_FOUND_ROUTE) {
							LtRouter.addRoute(
								PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw
							);
						}

						permissionStore.setDynamicAddedRoute(true);
					}
				}
			}
			await LtRouter.replace(getAppConfig().routes?.homePage!!);
		},
		async logout() {
			this.setUserInfo(null);

			const { routes } = getAppConfig();
			let loginPath = '';
			if (routes) {
				const { LOGIN_ROUTE } = routes;
				if (LOGIN_ROUTE) {
					loginPath = LOGIN_ROUTE.path;
				}
			}

			LtRouter.push(loginPath);
		},
		confirmLoginOut() {
			const { createConfirm } = useMessage();
			createConfirm({
				iconType: 'warning',
				title: () => h('span', '确认退出当前账户吗？'),
				content: () => h('span', '退出登录后，您将无法收到该账号的通知'),
				okText: '退出',
				onOk: async () => {
					await this.logout();
				},
			});
		},
		resetState() {
			this.userInfo = null;
		},
	},
});
