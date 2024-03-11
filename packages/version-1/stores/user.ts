import { Persistent, getLTHttp } from '@lt-frame/utils';
import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { useMessage } from '@lt-frame/hooks';
import { h } from 'vue';
import { getAppConfig, getGlobalRouter } from '../configs';
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
				const data = await getLTHttp().post(
					{ url: 'api/login', data: [username, password] },
					{ errorMessageMode: 'none' }
				);
				this.setUserInfo(data);
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
				const { dynamicRoutes, basicRoutes } = getAppConfig();
				const routes = await permissionStore.buildRoutesAction(dynamicRoutes);
				routes.forEach((route) => {
					getGlobalRouter().addRoute(route as unknown as RouteRecordRaw);
				});
				getGlobalRouter().addRoute(
					basicRoutes?.PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw
				);
				permissionStore.setDynamicAddedRoute(true);
			}
			await getGlobalRouter().replace(getAppConfig().homePage!!);
		},
		async logout() {
			this.setUserInfo(null);
			const { basicRoutes } = getAppConfig();
			let loginPath = '';
			if (basicRoutes) {
				const { LOGIN_ROUTE } = basicRoutes;
				if (LOGIN_ROUTE) {
					loginPath = LOGIN_ROUTE.path;
				}
			}
			getGlobalRouter().push(loginPath);
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
