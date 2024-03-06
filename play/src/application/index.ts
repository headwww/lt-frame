import { defineCache, defineHttp } from '@lt-frame/utils';

import { defineConfig_v1 } from '@lt-frame/version-1';
import { App } from 'vue';
import { createWebHashHistory } from 'vue-router';

import { createPinia } from 'pinia';

export const LTHttp = defineHttp();

export const { router } = defineConfig_v1({
	routerOptions: {
		history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
});

export const store = createPinia();

export function onCreate(app: App) {
	defineCache({
		appLocalCacheKey: 'SSSS',
		hasEncrypt: false,
	});

	LTHttp;

	app.use(store);
	app.use(router);
}
