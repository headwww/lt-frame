<template>
	<LtDropdown
		:trigger="['click']"
		@openChange="handleOpenChange"
		:drop-menu-list="getDropMenuList"
		@menu-event="handleMenuEvent"
	>
		<div :class="ns.b()">
			<Avatar :class="ns.e('avatar')">{{
				getClient?.user?.username[0]
			}}</Avatar>
			<div :class="ns.e('content')">
				<div :class="ns.e('content-name')">{{ getClient?.user?.username }}</div>
				<div :class="ns.e('content-tag')">
					<span :class="ns.e('content-tag-content')" style="cursor: inherit"
						><div :class="ns.e('content-tag-content-text')">
							{{ getClient?.user?.employee.name }}
						</div></span
					>
				</div>
			</div>
			<div :style="rotate" style="transition: transform 0.3s ease">
				<CaretDownOutlined style="color: rgb(100 106 115)" />
			</div>
		</div>
	</LtDropdown>
</template>

<script lang="ts" setup>
import { DropMenu, LtDropdown } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';
import { Avatar } from 'ant-design-vue';
import { CaretDownOutlined } from '@ant-design/icons-vue';
import { computed, ref } from 'vue';
import { useUserStore } from '../../../../stores';
import { useGo } from '../../../../hooks';

const ns = useNamespace('user-info');

const userStore = useUserStore();

const getClient = computed(() => userStore.getClient);

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
	{
		text: '错误日志',
		event: 'ERROR_LOG',
	},
]);

const go = useGo();

function handleMenuEvent(menu: DropMenu): void {
	const { event } = menu;
	switch (event) {
		case 'LOGIN_OUT':
			userStore.confirmLoginOut();
			break;
		case 'ERROR_LOG':
			go('/error-log');
			break;
		default:
			break;
	}
}
</script>
