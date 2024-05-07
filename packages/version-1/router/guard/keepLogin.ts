// import { Persistent } from '@lt-frame/utils';
import { useMessage } from '@lt-frame/hooks';
import { useUserStore } from '@lt-frame/version-1/stores';
import { Router } from 'vue-router';
import { LtHttp } from '../../configs';

export function createKeepLogin(router: Router) {
	const userStore = useUserStore();

	router.beforeEach(async (to, from, next) => {
		const client = userStore.getClient;

		const { createErrorModal } = useMessage();
		// 有用户登录信息 并且是刚打开页面直接重新登录
		if (client && !window.LT_KEEP_LOGIN) {
			const isGo = await LtHttp.post(
				{
					url: 'api/login',
					data: [client.user?.username, client.user?.password],
				},
				{ errorMessageMode: 'none' }
			)
				.then(() => {
					window.LT_KEEP_LOGIN = true;
					return true;
				})
				.catch((error) => {
					createErrorModal({
						title: '错误提示',
						content: error.message,
					});
					return true;
				});
			next();
			return isGo;
		}
		window.LT_KEEP_LOGIN = true;
		// 没有用户登录信息直接执行后续流程
		next();
		return true;
	});
}
