// import { defineConfig_v1, setupRouterGuard } from 'lt-frame';
import { defineConfig_v1, setupRouterGuard } from '@lt-frame/version-1';
import { App } from 'vue';
import { createWebHashHistory } from 'vue-router';
import { asyncRoutes } from '../router';

export const { router, pinia, LTHttp } = defineConfig_v1({
	dynamicRoutes: asyncRoutes,
	routerConfig: {
		history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	cacheConfig: {
		appLocalCacheKey: 'LT-Demo',
		hasEncrypt: !import.meta.env.DEV,
	},
});

export function onCreate(app: App) {
	app.use(pinia);
	app.use(router);
	setupRouterGuard(router);
}
