import { RouteLocationNormalized, RouteRecordRaw, Router } from 'vue-router';
import {
	AxiosCanceler,
	removeTabChangeListener,
	setRouteChange,
	throwError,
} from '@lt-frame/utils';
import { Modal, notification } from 'ant-design-vue';
import { getAppConfig, getWhitePathList } from '../../configs';
import {
	useAppStore,
	usePermissionStore,
	useUserStore,
	useTabStore,
} from '../../stores';

export function setupRouterGuard(router: Router) {
	createPageGuard(router);
	createPageLoadingGuard(router);
	createHttpGuard(router);
	createScrollGuard(router);
	createMessageGuard(router);
	createPermissionGuard(router);
	createStateGuard(router);
}

/**
 * 优化页面加载体验，记录哪些页面已经加载过，以便在再次访问这些页面时，
 * 可以避免不必要的加载和处理，从而提供更快的页面切换和加载速度。
 */
function createPageGuard(router: Router) {
	const loadedPageMap = new Map<string, boolean>();
	router.beforeEach(async (to) => {
		// 页面已经加载，再次打开会更快，不需要进行加载和其他处理
		to.meta.loaded = !!loadedPageMap.get(to.path);
		// 通知路由更改
		setRouteChange(to);
		return true;
	});

	router.afterEach((to) => {
		loadedPageMap.set(to.path, true);
	});
}

/**
 * 在页面加载时显示加载状态，以提供用户一个视觉提示，同时在加载完成后隐藏加载状态，以确保用户体验良好。
 * 这在处理异步加载的页面内容时非常有用，以避免用户感到页面过于快速地切换或加载。
 */
function createPageLoadingGuard(router: Router) {
	const userStore = useUserStore();
	const appStore = useAppStore();
	router.beforeEach(async (to) => {
		if (!userStore.getUserInfo) {
			return true;
		}
		if (to.meta.loaded) {
			return true;
		}

		appStore.setPageLoadingAction(true);
		return true;
	});
	router.afterEach(async () => {
		// TODO: 需要寻找更好的方式
		// 计时器模拟加载时间以防止闪烁过快，
		setTimeout(() => {
			appStore.setPageLoading(false);
		}, 320);
		return true;
	});
}

/**
 * 确保在路由切换时取消所有未完成的HTTP请求，以提高应用的稳定性和性能。
 * 这在某些情况下很有用，特别是当用户在加载页面时进行了路由切换，防止之前的请求继续发送或处理。
 * 这有助于避免不必要的网络请求和潜在的资源浪费。
 * 提示：需要在projectSetting中开启removeAllHttpPending。
 */
function createHttpGuard(router: Router) {
	const { removeAllHttpPending } = getAppConfig();
	let axiosCanceler: AxiosCanceler | null;
	if (removeAllHttpPending) {
		axiosCanceler = new AxiosCanceler();
	}
	router.beforeEach(async () => {
		// 切换路由将删除以前的请求
		axiosCanceler?.removeAllPending();
		return true;
	});
}

/**
 * 确保当用户在页面中点击包含锚点链接的路由时，页面会滚动到锚点链接所对应的位置，以提供更好的用户体验。
 * 它在路由切换后，通过检查目标路由是否包含锚点链接，并滚动到页面的顶部来实现这一目标。
 * 这在单页应用中的滚动行为控制方面很有用。
 */
function createScrollGuard(router: Router) {
	const isHash = (href: string) => /^#/.test(href);
	const { body } = document;
	router.afterEach(async (to) => {
		isHash((to as RouteLocationNormalized & { href: string })?.href) &&
			body.scrollTo(0, 0);
		return true;
	});
}

/**
 * 确保在路由切换前关闭可能已经打开的消息弹窗和通知，以提供更好的用户体验，避免用户在页面切换时看到未关闭的消息弹窗。
 */
export function createMessageGuard(router: Router) {
	const { closeMessageOnSwitch } = getAppConfig();

	router.beforeEach(async () => {
		try {
			if (closeMessageOnSwitch) {
				Modal.destroyAll();
				notification.destroy();
			}
		} catch (error) {
			//
			throwError('createMessageGuard', `message guard error:${error}`);
		}
		return true;
	});
}

/**
 * 路由鉴权
 */
export function createPermissionGuard(router: Router) {
	const permissionStore = usePermissionStore();
	const userStore = useUserStore();

	router.beforeEach(async (to, from, next) => {
		const userInfo = userStore.getUserInfo;
		const { dynamicRoutes, basicRoutes } = getAppConfig();
		let loginPath = '';
		if (basicRoutes) {
			const { LOGIN_ROUTE } = basicRoutes;
			if (LOGIN_ROUTE) {
				loginPath = LOGIN_ROUTE.path;
			}
		}

		// 处理白名单路径
		if (getWhitePathList().includes(to.path)) {
			// 如果用户已登录并且目标路径是登录页,则跳过登录页面直接进入（to.query?.redirect）或根路径('/')
			if (to.path === loginPath && userInfo) {
				try {
					if (userInfo) {
						next((to.query?.redirect as string) || '/');
						return;
					}
				} catch {
					//
				}
			}
			next();
			return;
		}

		// 处理未登录情况
		if (!userInfo) {
			// 如果用户未登录且目标路径不在白名单中，根据路由的元信息（meta.ignoreAuth）判断是否需要权限验证。
			if (to.meta.ignoreAuth) {
				next();
				return;
			}
			// 如果需要权限验证，则重定向到登录页（LOGIN_PATH），并在登录后重定向到原始目标路径，以便用户在登录后访问所需页面。
			const redirectData: {
				path: string;
				replace: boolean;
				query?: Record<string, string>;
			} = {
				path: loginPath,
				replace: true,
			};
			if (to.path) {
				redirectData.query = {
					...redirectData.query,
					redirect: to.path,
				};
			}
			next(redirectData);
			return;
		}
		// 动态路由是否已经添加
		if (permissionStore.getDynamicAddedRoute) {
			next();
			return;
		}

		// 添加动态路由
		const routes = await permissionStore.buildRoutesAction(dynamicRoutes);
		routes.forEach((route) => {
			router.addRoute(route as unknown as RouteRecordRaw);
		});
		router.addRoute(
			basicRoutes?.PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw
		);

		permissionStore.setDynamicAddedRoute(true);
		if (to.name === getAppConfig().basicRoutes?.PAGE_NOT_FOUND_ROUTE?.name) {
			// 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
			next({ path: to.fullPath, replace: true, query: to.query });
		} else {
			const redirectPath = (from.query.redirect || to.path) as string;
			const redirect = decodeURIComponent(redirectPath);
			const nextData =
				to.path === redirect ? { ...to, replace: true } : { path: redirect };
			next(nextData);
		}
	});
}

export function createStateGuard(router: Router) {
	router.afterEach((to) => {
		const { basicRoutes } = getAppConfig();

		let loginPath = '';
		if (basicRoutes) {
			const { LOGIN_ROUTE } = basicRoutes;
			if (LOGIN_ROUTE) {
				loginPath = LOGIN_ROUTE.path;
			}
		}

		if (to.path === loginPath) {
			const tabStore = useTabStore();
			const userStore = useUserStore();
			const appStore = useAppStore();
			const permissionStore = usePermissionStore();
			appStore.resetAllState();
			permissionStore.resetState();
			tabStore.resetState();
			userStore.resetState();
			removeTabChangeListener();
		}
	});
}
