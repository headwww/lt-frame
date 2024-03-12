<template>
	<div :class="ns.b()">
		<span>
			<!-- <MenuUnfoldOutlined v-if="getCollapsed" /> -->
			<!-- <MenuFoldOutlined v-else /> -->
			<MenuFoldOutlined />
		</span>
		<span>收起导航</span>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';

const ns = useNamespace('sider-trigger');
</script>
