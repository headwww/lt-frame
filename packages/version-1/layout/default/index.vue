<template>
	<Layout :class="ns.b()">
		<LayoutHeader />
		<Layout :class="ns.e('sider-content')">
			<LayoutSider />
			<Layout :class="ns.e('content')">
				<Tabs />
				<LayoutContent />
			</Layout>
		</Layout>
	</Layout>
</template>

<script lang="ts" setup>
import { Layout } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import { getGlobalRouter } from '@lt-frame/version-1/configs';
import LayoutHeader from './header/index.vue';
import Tabs from './tabs/index.vue';
import LayoutSider from './sider/index.vue';
import LayoutContent from './conent/index.vue';

const ns = useNamespace('main-layout');

console.log(getGlobalRouter().getRoutes());
</script>
