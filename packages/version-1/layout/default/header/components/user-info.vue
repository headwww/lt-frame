<template>
	<LTDropdown
		:trigger="['click']"
		@openChange="handleOpenChange"
		:drop-menu-list="getDropMenuList"
		@menu-event="handleMenuEvent"
	>
		<div :class="ns.b()">
			<Avatar :class="ns.e('avatar')">{{ getUserInfo.username[0] }}</Avatar>
			<div :class="ns.e('content')">
				<div :class="ns.e('content-name')">{{ getUserInfo.username }}</div>
				<div :class="ns.e('content-tag')">
					<span :class="ns.e('content-tag-content')" style="cursor: inherit"
						><div :class="ns.e('content-tag-content-text')">
							{{ getUserInfo.employee }}
						</div></span
					>
				</div>
			</div>
			<div :style="rotate" style="transition: transform 0.3s ease">
				<CaretDownOutlined style="color: rgb(100 106 115)" />
			</div>
		</div>
	</LTDropdown>
</template>

<script lang="ts" setup>
import { DropMenu, LTDropdown } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';
import { Avatar } from 'ant-design-vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import { useUserStore } from '../../../../stores';

const ns = useNamespace('user-info');

const userStore = useUserStore();

const getUserInfo = computed(() => {
	const { username = '', employee } = userStore.getUserInfo || {};
	return { username, employee };
});

const rotation = ref(0);
const rotate: any = computed(() => ({
	transform: `rotate(${rotation.value}deg)`,
}));

const handleOpenChange = (open: boolean) => {
	rotation.value = open ? 180 : 0;
};

const getDropMenuList = computed(() => [
	{
		text: '退出登录',
		event: 'LOGIN_OUT',
	},
]);

function handleMenuEvent(menu: DropMenu): void {
	const { event } = menu;
	switch (event) {
		case 'LOGIN_OUT':
			userStore.confirmLoginOut();
			break;
		default:
			break;
	}
}
</script>
