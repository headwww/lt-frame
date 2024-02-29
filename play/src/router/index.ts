import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

export const router = createRouter({
	history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
	strict: true,
	routes: [
		{
			path: '/',
			name: 'Root',
			component: () => import('../demo/button/index.vue'),
			meta: {
				title: 'Root',
			},
		},
	],
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

export async function setupRouter(app: App) {
	app.use(router);
}
