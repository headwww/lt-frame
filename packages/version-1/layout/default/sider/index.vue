<template>
	<LayoutSider
		v-model:collapsed="getCollapsed"
		:class="ns.b()"
		:collapsedWidth="56"
		:width="236"
	>
		<div :class="ns.e('children')">
			<LtScrollbar :class="ns.e('menu')">
				<Menu
					:class="ns.e('menu-list')"
					mode="inline"
					v-model:openKeys="openKeys"
					v-model:selectedKeys="selectedKeys"
					@click="handleMenuClick"
				>
					<template v-for="item in items" :key="item.path">
						<SubMenuItem :item="item" />
					</template>
				</Menu>
			</LtScrollbar>

			<Trigger></Trigger>
		</div>
	</LayoutSider>
</template>

<script lang="ts" setup>
import { LayoutSider, Menu } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import { LtScrollbar } from '@lt-frame/components';
import { ref, unref, watch } from 'vue';
import { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { isUrl, listenerRouteChange, openWindow } from '@lt-frame/utils';
import { useRouter } from 'vue-router';
import { uniq } from 'lodash-es';
import { usePermissionStore } from '../../../stores';
import Trigger from './components/trigger.vue';
import SubMenuItem from './components/sub-menu-item.vue';
import { useGo, useMenuSetting } from '../../../hooks';
import { getAllParentPath } from '../../../router/helper/menuHelper';

const { getCollapsed, getOpenKeys, setOpenKeys } = useMenuSetting();

const ns = useNamespace('sider');

const { currentRoute } = useRouter();

const permissionStore = usePermissionStore();
const items = permissionStore.getMenuList;

const openKeys = ref<string[]>(getCollapsed.value ? [] : unref(getOpenKeys));

const selectedKeys = ref<string[]>([]);

const go = useGo();

async function handleMenuClick(menu: MenuInfo) {
	const url = menu.key as string;
	// 跳转到外部地址
	if (isUrl(url)) {
		openWindow(url);
		return;
	}
	go(url);
}

listenerRouteChange((route) => {
	if (route.name === 'Redirect') return;
	const { path } = route || unref(currentRoute);
	selectedKeys.value[0] = path;
	const keys = getAllParentPath(items, path);
	if (!getCollapsed.value) {
		openKeys.value = uniq([...openKeys.value, ...keys]);
	}
});

watch(
	() => getCollapsed.value,
	() => {
		if (!getCollapsed.value) {
			const { path } = unref(currentRoute);
			const keys = getAllParentPath(items, path);
			openKeys.value = uniq([...getOpenKeys.value, ...keys]);
		}
	}
);

watch(
	() => openKeys.value,
	() => {
		if (!getCollapsed.value) {
			setOpenKeys(openKeys.value);
		}
	}
);
</script>
