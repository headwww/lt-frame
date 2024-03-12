<template>
	<MenuItem :key="item.path">
		<MenuItemContent v-bind="$props" :item="item" />
	</MenuItem>
</template>

<script lang="ts" setup>
import { MenuItem } from 'ant-design-vue';
import { PropType } from 'vue';
import MenuItemContent from './menu-item-content.vue';
import { Menu } from '../../../../types';

defineProps({
	item: {
		type: Object as PropType<Menu>,
		default: () => ({}),
	},
});
</script>
