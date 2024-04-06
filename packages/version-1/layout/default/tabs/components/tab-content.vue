<template>
	<LtDropdown
		:dropMenuList="getDropMenuList"
		:trigger="['contextmenu']"
		placement="bottom"
		@menu-event="handleMenuEvent"
	>
		<span @contextmenu="handleContext">{{ getTitle }}</span>
	</LtDropdown>
</template>

<script lang="ts">
import { DropMenu, LtDropdown } from '@lt-frame/components';
import { PropType, computed, defineComponent, reactive, unref } from 'vue';
import { RouteLocationNormalized, useRouter } from 'vue-router';
import { useTabStore } from '../../../../stores';
import { getGlobalRouter } from '../../../../configs';

export default defineComponent({
	name: 'LtTabContent',
	components: {
		LtDropdown,
	},
	props: {
		tabItem: {
			type: Object as PropType<RouteLocationNormalized>,
			default: null,
		},
	},
	setup(props) {
		/**
		 * 右键所获取的tab
		 */
		const state = reactive({
			current: null as RouteLocationNormalized | null,
			currentIndex: 0,
		});

		const getTitle = computed(() => {
			const { tabItem: { meta } = {} } = props;
			return meta && meta.title;
		});

		const tabStore = useTabStore();

		function handleContext(e: MouseEvent) {
			if (props.tabItem) {
				if (!props.tabItem) {
					return;
				}
				e.preventDefault();
				const index = tabStore.getTabList.findIndex(
					(tab) => tab.path === props.tabItem.path
				);
				state.current = props.tabItem;
				state.currentIndex = index;
			}
		}

		const { currentRoute } = useRouter();

		const getDropMenuList = computed(() => {
			const { path, meta } = unref(currentRoute);
			const curItem = state.current;
			const isCurItem = curItem ? curItem.path === path : false;
			const refreshDisabled = !isCurItem;
			const index = state.currentIndex;
			const closeLeftDisabled = index === 0 || !isCurItem;
			const disabled = tabStore.getTabList.length === 1;
			const closeRightDisabled =
				!isCurItem ||
				(index === tabStore.getTabList.length - 1 &&
					tabStore.getLastDragEndIndex >= 0);
			const dropMenuList: DropMenu[] = [
				{
					text: '重新加载',
					event: 'REFRESH_PAGE',
					disabled: refreshDisabled,
				},
				{
					text: '关闭标签',
					event: 'CLOSE_CURRENT',
					disabled: !!meta?.affix || disabled,
					divider: true,
				},
				{
					text: '关闭左侧标签',
					event: 'CLOSE_LEFT',
					disabled: closeLeftDisabled,
					divider: false,
				},
				{
					text: '关闭右侧标签',
					disabled: closeRightDisabled,
					event: 'CLOSE_RIGHT',
					divider: true,
				},
				{
					text: '关闭其他标签',
					event: 'CLOSE_OTHER',
					disabled: disabled || !isCurItem,
				},
				{
					text: '关闭全部标签',
					event: 'CLOSE_ALL',
					disabled,
				},
			];
			return dropMenuList;
		});

		function getCurrentTab() {
			const route = unref(currentRoute);
			return tabStore.getTabList.find(
				(item) => item.fullPath === route.fullPath
			)!;
		}

		function handleMenuEvent(menu: DropMenu): void {
			const { event } = menu;
			const router = getGlobalRouter();
			switch (event) {
				case 'REFRESH_PAGE':
					tabStore.refreshPage(router);
					break;
				case 'CLOSE_CURRENT':
					tabStore.closeTab(props.tabItem, router);
					break;
				case 'CLOSE_LEFT':
					tabStore.closeLeftTabs(getCurrentTab(), router);
					break;
				case 'CLOSE_RIGHT':
					tabStore.closeRightTabs(getCurrentTab(), router);
					break;
				case 'CLOSE_OTHER':
					tabStore.closeOtherTabs(getCurrentTab(), router);
					break;
				case 'CLOSE_ALL':
					tabStore.closeAllTab(router);
					break;
				default:
					break;
			}
		}
		return {
			handleContext,
			getDropMenuList,
			getTitle,
			handleMenuEvent,
		};
	},
});
</script>
