<template>
	<div @click="toggleCollapsed" :class="ns.b()">
		<span
			style="
				margin-left: 8px;
				margin-right: 12px;
				display: flex;
				align-items: center;
			"
		>
			<MenuUnfoldOutlined v-if="getCollapsed" />
			<MenuFoldOutlined v-else />
		</span>
		<span v-if="!getCollapsed">收起导航</span>
	</div>
</template>

<script lang="ts" setup>
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { useNamespace } from '@lt-frame/hooks';
import { useMenuSetting } from '../../../../hooks';

const ns = useNamespace('sider-trigger');

const { getCollapsed, toggleCollapsed } = useMenuSetting();
</script>
