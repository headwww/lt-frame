<template>
	<LtPageLayout title="下拉菜单">
		<LtDropdown
			@menu-event="handleMenuEvent"
			:dropMenuList="dropMenuList"
			:trigger="['contextmenu']"
			><LtButton>单击右键</LtButton></LtDropdown
		>
		<LtDropdown
			@menu-event="handleMenuEvent"
			:dropMenuList="dropMenuList"
			:trigger="['hover']"
			><LtButton>hover</LtButton></LtDropdown
		>
		<LtDropdown
			:popconfirm="false"
			:dropMenuList="dropMenuList"
			:trigger="['click']"
			@menu-event="handleMenuEvent"
			><LtButton>点击显示</LtButton></LtDropdown
		>
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	LtButton,
	LtPageLayout,
	LtDropdown,
	DropMenu,
} from '@lt-frame/components';
import { useMessage } from '@lt-frame/hooks';

const dropMenuList: DropMenu[] = [
	{
		text: '重新加载',
		event: 'REFRESH_PAGE',
		disabled: false,
		icon: 'svg-icon:file',
	},
	{
		text: '关闭标签',
		event: 'CLOSE_CURRENT',
		disabled: true,
		divider: true,
	},
	{
		text: '关闭左侧标签',
		event: 'CLOSE_LEFT',
		divider: false,
	},
	{
		text: '关闭右侧标签',
		event: 'CLOSE_RIGHT',
		divider: true,
	},
	{
		text: '关闭其他标签',
		event: 'CLOSE_OTHER',
	},
	{
		text: '关闭全部标签',
		event: 'CLOSE_ALL',
	},
];

const { createMessage } = useMessage();
function handleMenuEvent(menu: DropMenu): void {
	const { event } = menu;
	switch (event) {
		case 'REFRESH_PAGE':
			createMessage.success('REFRESH_PAGE');
			break;
		case 'CLOSE_CURRENT':
			createMessage.success('CLOSE_CURRENT');
			break;
		case 'CLOSE_LEFT':
			createMessage.success('CLOSE_LEFT');

			break;
		case 'CLOSE_RIGHT':
			createMessage.success('CLOSE_RIGHT');

			break;
		case 'CLOSE_OTHER':
			createMessage.success('CLOSE_OTHER');

			break;
		case 'CLOSE_ALL':
			createMessage.success('CLOSE_ALL');

			break;
		default:
			break;
	}
}
</script>
