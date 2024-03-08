<template>
	<Layout :class="ns.b()">
		<LayoutHeader />
		<Layout>
			<LayoutSider />
			<Layout :class="ns.e('content')">
				<Tabs :class="ns.e('content-tab')" />
				<LayoutContent />
			</Layout>
		</Layout>
	</Layout>
</template>

<script lang="ts" setup>
import { Layout } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import LayoutHeader from './header/index.vue';
import Tabs from './tabs/index.vue';
import LayoutSider from './sider/index.vue';
import LayoutContent from './conent/index.vue';

const ns = useNamespace('layout');
</script>
