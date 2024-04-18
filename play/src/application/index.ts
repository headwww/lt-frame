import {
	LtPinia,
	LtRouter,
	ProjectConfig,
	defineConfig,
	setupRouterGuard,
	useAppStore,
} from '@lt-frame/version-1';
import { App } from 'vue';
import { createWebHashHistory } from 'vue-router';
import VXETable from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';

import { Persistent, deepMerge } from '@lt-frame/utils';
import { LtTableConfig } from '@lt-frame/components';
import { asyncRoutes } from '../router';

VXETable.use(VXETablePluginAntd);
LtTableConfig();

defineConfig({
	routes: {
		dynamicRoutes: asyncRoutes,
	},
	router: {
		history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	cache: {
		appLocalCacheKey: 'LT-DEMO',
		hasEncrypt: !import.meta.env.DEV,
	},
});

export function initProjectConfig() {
	const appStore = useAppStore();
	let projCfg: ProjectConfig = Persistent.getLocal('PROJ_KEY') as ProjectConfig;

	projCfg = deepMerge(
		{
			menuSetting: {
				// 菜单是否折叠
				collapsed: false,
				// 菜单打开的subMenu
				openKeys: [],
			},
		},
		projCfg || {}
	);
	appStore.setProjectConfig(projCfg);
}

export function onCreate(app: App) {
	app.use(LtPinia);
	initProjectConfig();
	app.use(LtRouter);
	app.use(VXETable);
	setupRouterGuard(LtRouter);
}
