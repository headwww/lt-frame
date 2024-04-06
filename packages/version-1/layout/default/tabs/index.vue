<template>
	<Tabs
		:class="ns.b()"
		:hideAdd="true"
		type="editable-card"
		:animated="false"
		:activeKey="activeKeyRef"
		@change="handleChange"
		@edit="(e) => handleEdit(`${e}`)"
	>
		<template
			v-for="item in getTabs"
			:key="item.query ? item.fullPath : item.path"
		>
			<TabPane :closable="!(item && item.meta && item.meta.affix)">
				<template #tab>
					<TabContent :tabItem="item" />
				</template>
			</TabPane>
		</template>
	</Tabs>
</template>

<script lang="ts">
import { Tabs, TabPane } from 'ant-design-vue';
import { computed, defineComponent, ref, unref } from 'vue';
import { RouteMeta, useRouter } from 'vue-router';
import { listenerRouteChange } from '@lt-frame/utils';
import { useNamespace } from '@lt-frame/hooks';
import { getAppConfig } from '../../../configs';
import { useTabStore, useUserStore } from '../../../stores';
import TabContent from './components/tab-content.vue';
import { initAffixTabs, useTabsDrag } from './useTabs';
import { useGo } from '../../../hooks';

export default defineComponent({
	name: 'LtTab',
	components: {
		Tabs,
		TabPane,
		TabContent,
	},
	setup() {
		const ns = useNamespace('tabs');

		const tabStore = useTabStore();

		const userStore = useUserStore();

		const router = useRouter();

		const go = useGo();

		const activeKeyRef = ref('');

		const affixTextList = initAffixTabs();

		useTabsDrag(affixTextList);

		const getTabs = computed(() =>
			tabStore.getTabList.filter((item) => !item.meta?.hideTab)
		);

		const unClose = computed(() => unref(getTabs).length === 1);

		listenerRouteChange((route) => {
			const { name } = route;
			if (
				name === getAppConfig().redirectName ||
				!route ||
				!userStore.getUserInfo
			) {
				return;
			}
			const { path, fullPath, meta = {} } = route;
			const { hideTab } = meta as RouteMeta;
			const p = hideTab || fullPath || path;
			if (activeKeyRef.value !== p) {
				activeKeyRef.value = p as string;
			}
			if (!hideTab) {
				tabStore.addTab(unref(route));
			}
		});

		function handleChange(activeKey: any) {
			activeKeyRef.value = activeKey;
			go(activeKey, false);
		}

		function handleEdit(targetKey: string) {
			if (unref(unClose)) {
				return;
			}
			tabStore.closeTabBykey(targetKey, router);
		}

		return {
			ns,
			handleEdit,
			handleChange,
			activeKeyRef,
			getTabs,
		};
	},
});
</script>
