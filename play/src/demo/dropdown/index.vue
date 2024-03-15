<template>
	<LTPageLayout title="下拉菜单">
		<LTDropdown
			@menu-event="handleMenuEvent"
			:dropMenuList="dropMenuList"
			:trigger="['contextmenu']"
			><LTButton>单击右键</LTButton></LTDropdown
		>
		<LTDropdown
			@menu-event="handleMenuEvent"
			:dropMenuList="dropMenuList"
			:trigger="['hover']"
			><LTButton>hover</LTButton></LTDropdown
		>
		<LTDropdown
			:popconfirm="false"
			:dropMenuList="dropMenuList"
			:trigger="['click']"
			@menu-event="handleMenuEvent"
			><LTButton>点击显示</LTButton></LTDropdown
		>
	</LTPageLayout>
</template>

<script setup lang="ts">
import {
	LTButton,
	LTPageLayout,
	LTDropdown,
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
