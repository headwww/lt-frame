import { defineStore } from 'pinia';
import { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';
import { toRaw, unref } from 'vue';
import { Persistent, getRawRoute } from '@lt-frame/utils';
import { useGo, useRedo } from '../hooks';
import { getAppConfig } from '../configs';

export interface TabState {
	cacheTabList: Set<string>;
	tabList: RouteLocationNormalized[];
	lastDragEndIndex: number;
}

export const useTabStore = defineStore({
	id: 'lt-tab',
	state: (): TabState => ({
		// 需要缓存的选项
		cacheTabList: new Set(),
		// tab
		tabList: Persistent.getLocal('TABS_KEY') || [],
		// 上次移动的选项卡的索引
		lastDragEndIndex: 0,
	}),
	getters: {
		getTabList(state): RouteLocationNormalized[] {
			return state.tabList;
		},
		getCachedTabList(state): string[] {
			return Array.from(state.cacheTabList);
		},
		getLastDragEndIndex(state): number {
			return state.lastDragEndIndex;
		},
	},
	actions: {
		// 根据当前打开的选项卡更新缓存
		async updateCacheTab() {
			const cacheMap: Set<string> = new Set();
			this.tabList.forEach((tab) => {
				const item = getRawRoute(tab);
				// 忽略缓存
				const needCache = !item.meta?.ignoreKeepAlive;
				if (needCache) {
					const name = item.name as string;
					cacheMap.add(name);
				}
			});
			this.cacheTabList = cacheMap;
		},
		// 添加tab
		async addTab(route: RouteLocationNormalized) {
			const { path, name, fullPath, params, query } = getRawRoute(route);
			// 404页面不需要添加
			if (
				path === '/exception' ||
				path === getAppConfig().basicRoutes?.LOGIN_ROUTE?.path ||
				!name ||
				[
					getAppConfig().basicRoutes?.REDIRECT_ROUTE?.name,
					getAppConfig().basicRoutes?.PAGE_NOT_FOUND_ROUTE?.name,
				].includes(name as string)
			) {
				return;
			}
			let updateIndex = -1;
			// 现有页面，不要重复添加选项卡
			const tabHasExits = this.tabList.some((tab, index) => {
				updateIndex = index;
				return (tab.fullPath || tab.path) === (fullPath || path);
			});
			// 如果选项卡已存在，执行更新操作
			if (tabHasExits) {
				const curTab = toRaw(this.tabList)[updateIndex];
				if (!curTab) {
					return;
				}
				curTab.params = params || curTab.params;
				curTab.query = query || curTab.query;
				curTab.fullPath = fullPath || curTab.fullPath;
				this.tabList.splice(updateIndex, 1, curTab);
			} else {
				this.tabList.push(route);
			}
			this.updateCacheTab();
			Persistent.setLocal('TABS_KEY', this.tabList);
		},
		async closeTab(tab: RouteLocationNormalized, router: Router) {
			const close = (route: RouteLocationNormalized) => {
				const { fullPath, meta: { affix } = {} } = route;
				if (affix) {
					return;
				}
				const index = this.tabList.findIndex(
					(item) => item.fullPath === fullPath
				);
				index !== -1 && this.tabList.splice(index, 1);
			};

			const { currentRoute, replace } = router;

			const { path } = unref(currentRoute);
			if (path !== tab.path) {
				// 关闭不是固定选项卡
				close(tab);
				this.updateCacheTab();
				return;
			}

			// 关闭激活的选项卡
			let toTarget: RouteLocationRaw = {};

			const index = this.tabList.findIndex((item) => item.path === path);

			// 如果当前是最左边的选项卡
			if (index === 0) {
				// 只有一个选项卡，然后跳到主页，否则跳到右侧选项卡
				if (this.tabList.length === 1) {
					// const userStore = useUserStore();
					// toTarget = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
					toTarget = getAppConfig().homePage!!;
				} else {
					//  跳转到右侧选项卡
					const page = this.tabList[index + 1];
					toTarget = this.getToTarget(page);
				}
			} else {
				// 关闭当前选项卡
				const page = this.tabList[index - 1];
				toTarget = this.getToTarget(page);
			}
			close(currentRoute.value);
			await replace(toTarget);
		},

		async closeTabBykey(key: string, router: Router) {
			const index = this.tabList.findIndex(
				(item) => (item.fullPath || item.path) === key
			);
			if (index !== -1) {
				await this.closeTab(this.tabList[index], router);
				const { currentRoute, replace } = router;
				// 检查当前路由是否存在于tabList中
				const isActivated = this.tabList.findIndex(
					(item) => item.fullPath === currentRoute.value.fullPath
				);
				// 如果当前路由不存在于TabList中，尝试切换到其它路由
				if (isActivated === -1) {
					let pageIndex;
					if (index > 0) {
						pageIndex = index - 1;
					} else if (index < this.tabList.length - 1) {
						pageIndex = index + 1;
					} else {
						pageIndex = -1;
					}
					if (pageIndex >= 0) {
						const page = this.tabList[index - 1];
						const toTarget = this.getToTarget(page);
						await replace(toTarget);
					}
				}
			}
		},
		/**
		 * 刷新页面
		 */
		async refreshPage(router: Router) {
			const { currentRoute } = router;
			const route = unref(currentRoute);
			const { name } = route;

			const findTab = this.getCachedTabList.find((item) => item === name);
			if (findTab) {
				this.cacheTabList.delete(findTab);
			}
			const redo = useRedo(router);
			await redo();
		},
		clearCacheTabs(): void {
			this.cacheTabList = new Set();
		},
		goToPage(router: Router) {
			const go = useGo(router);
			const len = this.tabList.length;
			const { path } = unref(router.currentRoute);

			let toPath = getAppConfig().homePage;

			if (len > 0) {
				const page = this.tabList[len - 1];
				const p = page.fullPath || page.path;
				if (p) {
					toPath = p;
				}
			}
			path !== toPath && go(toPath, true);
		},

		async sortTabs(oldIndex: number, newIndex: number) {
			const currentTab = this.tabList[oldIndex];
			this.tabList.splice(oldIndex, 1);
			this.tabList.splice(newIndex, 0, currentTab);
			this.lastDragEndIndex += 1;
		},
		/**
		 * 关闭左侧
		 */
		async closeLeftTabs(route: RouteLocationNormalized, router: Router) {
			const index = this.tabList.findIndex((item) => item.path === route.path);

			if (index > 0) {
				const leftTabs = this.tabList.slice(0, index);
				const pathList: string[] = [];
				leftTabs.forEach((item) => {
					const affix = item?.meta?.affix ?? false;
					if (!affix) {
						pathList.push(item.fullPath);
					}
				});
				this.bulkCloseTabs(pathList);
			}
			this.updateCacheTab();
			Persistent.setLocal('TABS_KEY', this.tabList, true);
			this.handleGotoPage(router);
		},
		/**
		 * 关闭右侧
		 */
		async closeRightTabs(route: RouteLocationNormalized, router: Router) {
			const index = this.tabList.findIndex(
				(item) => item.fullPath === route.fullPath
			);
			if (index >= 0 && index < this.tabList.length - 1) {
				const rightTabs = this.tabList.slice(index + 1, this.tabList.length);

				const pathList: string[] = [];
				rightTabs.forEach((item) => {
					const affix = item?.meta?.affix ?? false;
					if (!affix) {
						pathList.push(item.fullPath);
					}
				});
				this.bulkCloseTabs(pathList);
			}
			this.updateCacheTab();
			Persistent.setLocal('TABS_KEY', this.tabList, true);
			this.handleGotoPage(router);
		},
		/**
		 * 关闭其他
		 */
		async closeOtherTabs(route: RouteLocationNormalized, router: Router) {
			const closePathList = this.tabList.map((item) => item.fullPath);

			const pathList: string[] = [];
			closePathList.forEach((path) => {
				if (path !== route.fullPath) {
					const closeItem = this.tabList.find((item) => item.fullPath === path);
					if (closeItem) {
						const affix = closeItem?.meta?.affix ?? false;
						if (!affix) {
							pathList.push(closeItem.fullPath);
						}
					}
				}
			});

			this.bulkCloseTabs(pathList);
			this.updateCacheTab();
			Persistent.setLocal('TABS_KEY', this.tabList, true);
			this.handleGotoPage(router);
		},

		/**
		 * 全部关闭
		 */
		async closeAllTab(router: Router) {
			this.tabList = this.tabList.filter((item) => item?.meta?.affix ?? false);
			this.clearCacheTabs();
			Persistent.setLocal('TABS_KEY', this.tabList, true);
			this.goToPage(router);
		},

		/**
		 * 批量关闭选项卡
		 */
		async bulkCloseTabs(pathList: string[]) {
			this.tabList = this.tabList.filter(
				(item) => !pathList.includes(item.fullPath)
			);
		},

		handleGotoPage(router: Router) {
			const go = useGo(router);
			go(unref(router.currentRoute).fullPath, true);
		},

		getToTarget(tabItem: RouteLocationNormalized) {
			const { params, path, query } = tabItem;
			return {
				params: params || {},
				path,
				query: query || {},
			};
		},
		/**
		 * 重制状态
		 */
		resetState(): void {
			this.tabList = [];
			this.clearCacheTabs();
		},
	},
});
