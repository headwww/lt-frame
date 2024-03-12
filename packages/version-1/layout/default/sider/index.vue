<template>
	<LayoutSider :class="ns.b()" :collapsedWidth="50" :width="236">
		<Menu
			:class="ns.e('menu')"
			:subMenuOpenDelay="0.2"
			:inlineIndent="24"
			mode="inline"
		>
			<template v-for="item in items" :key="item.path">
				<SubMenuItem :item="item" />
			</template>
		</Menu>
		<Trigger></Trigger>
	</LayoutSider>
</template>

<script lang="ts" setup>
import { LayoutSider, Menu } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import { usePermissionStore } from '../../../stores';
import Trigger from './components/trigger.vue';
import SubMenuItem from './components/sub-menu-item.vue';

const ns = useNamespace('sider');

const permissionStore = usePermissionStore();

const items = permissionStore.getMenuList;
</script>
