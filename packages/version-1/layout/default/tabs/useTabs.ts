import { nextTick, ref, toRaw } from 'vue';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { isNull, isUndefined } from 'lodash-es';
import { useTabStore } from '../../../stores';
import { useSortable } from '../../../hooks';
/**
 * 初始化并管理固定标签页，它会根据路由的元信息中的 affix 属性来确定哪些标签页应该固定在标签页导航栏中。
 * 它还将这些固定标签页信息存储在 affixList 中，并将它们添加到多标签页的状态管理中，
 * 以确保这些标签页始终可见。最后，它返回固定标签页的标题数组，以在界面上显示这些标签页的标题。
 * @returns
 */
export function initAffixTabs(): string[] {
	// 初始化一个空的路由位置数组，用于存储固定标签页的路由信息
	const affixList = ref<RouteLocationNormalized[]>([]);
	const tabStore = useTabStore();
	const router = useRouter();
	/**
	 * @description: 过滤出所有固定的标签页路由
	 */
	function filterAffixTabs(routes: RouteLocationNormalized[]) {
		const tabs: RouteLocationNormalized[] = [];
		routes &&
			routes.forEach((route) => {
				// 如果路由具有元信息且元信息中有 affix 属性，将其添加到标签页数组中
				if (route.meta && route.meta.affix) {
					tabs.push(toRaw(route));
				}
			});
		return tabs;
	}

	/**
	 * @description: 添加固定的标签页
	 */
	function addAffixTabs(): void {
		// 从当前路由器获取所有路由信息并筛选出固定标签页
		const affixTabs = filterAffixTabs(
			router.getRoutes() as unknown as RouteLocationNormalized[]
		);
		// 将固定标签页信息存储在 affixList 中
		affixList.value = affixTabs;
		// 遍历固定标签页并将它们添加到多标签页的状态管理中
		affixTabs.forEach((tab) => {
			tabStore.addTab({
				meta: tab.meta,
				name: tab.name,
				path: tab.path,
			} as unknown as RouteLocationNormalized);
		});
	}
	// 标志变量，用于确保 addAffixTabs() 仅调用一次
	let isAddAffix = false;
	// 如果尚未添加固定标签页，调用 addAffixTabs() 并将标志变量设置为 true
	if (!isAddAffix) {
		addAffixTabs();
		isAddAffix = true;
	}
	// 返回固定标签页的标题数组，过滤掉空值并转换为字符串数组
	return affixList.value
		.map((item: any) => item.meta?.title)
		.filter(Boolean) as string[];
}

/**
 * 用于处理标签页的拖拽功能
 * @param affixTextList
 */
export function useTabsDrag(affixTextList: string[]) {
	const tabStore = useTabStore();
	nextTick(() => {
		const el = document.querySelectorAll(
			`.ant-tabs-nav-wrap > div`
		)?.[0] as HTMLElement;
		const { initSortable } = useSortable(el, {
			filter: (_evt, target: HTMLElement) => {
				const text = target.innerText;
				if (!text) return false;
				return affixTextList.includes(text);
			},
			onEnd: (evt) => {
				const { oldIndex, newIndex } = evt;

				if (
					(isNull(oldIndex) && isUndefined(oldIndex)) ||
					(isNull(newIndex) && isUndefined(newIndex)) ||
					oldIndex === newIndex
				) {
					return;
				}

				tabStore.sortTabs(oldIndex!!, newIndex!!);
			},
		});
		initSortable();
	});
}
