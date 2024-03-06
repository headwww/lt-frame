import { Persistent, getLTHttp } from '@lt-frame/utils';
import { defineStore } from 'pinia';
import { getGlobalRouter } from '../configs';

export const useUserStore = defineStore({
	id: 'app-user',
	state: () => ({
		// 用户信息
		userInfo: null,
	}),
	getters: {
		getUserInfo(state): any {
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
			//
			await getGlobalRouter().replace('home-page');
		},
		async logout() {
			//
		},
		confirmLoginOut() {
			///
		},
		resetState() {
			this.userInfo = null;
		},
	},
});
