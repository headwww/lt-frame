import type { App } from 'vue';
import { createPinia } from 'pinia';

const store = createPinia();

export function setupStore(app: App<Element>) {
	app.use(store);
}

export * from './permission';
export * from './user';
export * from './app';
