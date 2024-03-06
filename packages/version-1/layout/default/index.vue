<template>
	<Layout class="main-layout">
		<LayoutHeader />
		<Layout>
			<LayoutSider />
			<Layout class="main-layout-content">
				<Tabs class="main-layout-content-tab" />
				<LayoutContent />
			</Layout>
		</Layout>
	</Layout>
</template>

<script lang="ts" setup>
import { Layout } from 'ant-design-vue';
import LayoutHeader from './header/indev.vue';
import Tabs from './tabs/indev.vue';
import LayoutSider from './sider/indev.vue';
import LayoutContent from './conent/indev.vue';
</script>
