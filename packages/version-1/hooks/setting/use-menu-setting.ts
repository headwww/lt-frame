import { computed, unref } from 'vue';
import { MenuSetting } from '@lt-frame/version-1/types';
import { useAppStore } from '../../stores';

export function useMenuSetting() {
	const appStore = useAppStore();

	const getCollapsed = computed(() => appStore.getMenuSetting.collapsed);

	const getOpenKeys = computed(() => appStore.getMenuSetting.openKeys);

	function setMenuSetting(menuSetting: Partial<MenuSetting>): void {
		appStore.setMenuSetting(menuSetting);
	}

	function toggleCollapsed() {
		setMenuSetting({
			collapsed: !unref(getCollapsed),
		});
	}

	function setOpenKeys(openKeys: string[]) {
		setMenuSetting({ openKeys });
	}

	return {
		getCollapsed,
		toggleCollapsed,
		getOpenKeys,
		setOpenKeys,
	};
}
