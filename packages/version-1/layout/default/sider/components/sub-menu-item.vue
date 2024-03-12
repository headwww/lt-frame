<template>
	<MenuItem
		v-if="!menuHasChildren(item) && getShowMenu"
		v-bind="$props"
	></MenuItem>
	<SubMenu v-if="menuHasChildren(item) && getShowMenu" :key="item.path">
		<template #title>
			<MenuItemContent v-bind="$props" :item="item" />
		</template>
		<template
			v-for="childrenItem in item.children || []"
			:key="childrenItem.path"
		>
			<SubMenuItem v-bind="$props" :item="childrenItem" />
		</template>
	</SubMenu>
</template>

<script lang="ts" setup>
import { SubMenu } from 'ant-design-vue';
import { PropType, computed } from 'vue';
import MenuItemContent from './menu-item-content.vue';
import MenuItem from './menu-item.vue';
import SubMenuItem from './sub-menu-item.vue';
import { Menu } from '../../../../types';

const props = defineProps({
	item: {
		type: Object as PropType<Menu>,
		default: () => ({}),
	},
});
/**
 * 筛选出hideMenu的菜单
 */
const getShowMenu = computed(() => !props.item.meta?.hideMenu);

/**
 * 判断子菜单是否需要显示
 * @param menuTreeItem
 */
function menuHasChildren(menuTreeItem: Menu): boolean {
	return (
		!menuTreeItem.meta?.hideChildrenInMenu &&
		Reflect.has(menuTreeItem, 'children') &&
		!!menuTreeItem.children &&
		menuTreeItem.children.length > 0
	);
}
</script>
