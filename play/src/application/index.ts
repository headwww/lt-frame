import {
	ProjectConfig,
	defineConfig_v1,
	setupRouterGuard,
	useAppStore,
} from '@lt-frame/version-1';
import { App } from 'vue';
import { createWebHashHistory } from 'vue-router';
import VXETable from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';

import { Persistent, deepMerge } from '@lt-frame/utils';
import { asyncRoutes } from '../router';

VXETable.use(VXETablePluginAntd);

export const { config, router, pinia, LTHttp } = defineConfig_v1({
	routerConfig: {
		history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
		strict: true,
		scrollBehavior: () => ({ left: 0, top: 0 }),
	},
	cacheConfig: {
		appLocalCacheKey: 'LT-DEMO',
		hasEncrypt: !import.meta.env.DEV,
	},
	dynamicRoutes: asyncRoutes,
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
	app.use(pinia);
	initProjectConfig();
	app.use(router);
	app.use(VXETable);

	setupRouterGuard(router);
}
