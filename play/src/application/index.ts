import {
	LtHttp,
	LtLinkTransducer,
	LtPinia,
	LtRouter,
	LtSuperSearch,
	ProjectConfig,
	SearchResult,
	defineConfig,
	setupErrorHandle,
	setupRouterGuard,
	useAppStore,
} from '@lt-frame/version-1';
import { App } from 'vue';
import { createWebHashHistory } from 'vue-router';
import VXETable from 'vxe-table';
import VXETablePluginAntd from 'vxe-table-plugin-antd';
import VxeUIAll from 'vxe-pc-ui';

import { Condition, Persistent, deepMerge, getCookie } from '@lt-frame/utils';
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
	componentInfoMap: [
		{
			component: () => import('../demo/table/config-table.vue'),
			name: 'TestManager',
			title: '测试',
		},
		{
			component: () => import('../demo/table/config-table.vue'),
			name: 'EquipmentKeepRecordManager',
			title: '设备保养维护',
		},
	],
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
	app.use(VxeUIAll);
	setupRouterGuard(LtRouter);
	setupErrorHandle(app);
}

LtSuperSearch.add('菜单', {
	createSearchMethod(params: any) {
		return new Promise((resolve) => {
			params;
			const arr: SearchResult[] = [];
			LtRouter.getRoutes().forEach((item) => {
				if ((item.meta.title as string).includes(params)) {
					arr.push({
						title: item.meta.title as string,
						icon: item.meta?.icon as string,
						name: item.name as string,
					});
				}
			});
			resolve(arr);
		});
	},
});

LtLinkTransducer;
getCookie;
// LtLinkTransducer.register('添加session', (link: string) => {
// 	const jsessionId = getCookie('JSESSIONID');
// 	return link.replace(/jsessionid=[^?&]+/, `jsessionid=${jsessionId}`);
// });

LtSuperSearch.add('工作中心', {
	createSearchMethod(params: any) {
		const condition = new Condition();
		condition.expr(
			`this.name like '%${params}%' or this.code like '%${params}%'`
		);
		condition.setTargetClass('lt.app.common.model.WorkCenter');
		return new Promise((resolve, reject) => {
			LtHttp.post<Array<any>>(
				{
					url: 'api/workCenterServiceImpl/findWorkCenters',
					data: [condition],
				},
				{
					errorMessageMode: 'none',
				}
			)
				.then((data: any) => {
					resolve(
						data?.map((item: any) => ({
							title: item.name,
							label: item.code,
							icon: 'svg-icon:jiaose',
							name: 'PERMISSION',
							params: JSON.stringify({
								id: item.id,
							}),
						}))
					);
				})
				.catch(() => {
					reject();
				});
		});
	},
});

LtSuperSearch.add('仓库', {
	createSearchMethod(params: any) {
		const condition = new Condition();
		condition.expr(
			`this.name like '%${params}%' or this.code like '%${params}%'`
		);
		condition.setTargetClass('lt.app.common.model.Store');
		return new Promise((resolve, reject) => {
			LtHttp.post<Array<any>>(
				{
					url: 'api/storeService/findStores',
					data: [condition],
				},
				{
					errorMessageMode: 'none',
				}
			)
				.then((data: any) => {
					resolve(
						data?.map((item: any) => ({
							title: item.name,
							label: item.code,
							icon: 'svg-icon:jiaoseguanli',
							name: 'feature',
							color: '#2766f9',
							params: JSON.stringify({
								id: item.id,
							}),
						}))
					);
				})
				.catch(() => {
					reject();
				});
		});
	},
});
