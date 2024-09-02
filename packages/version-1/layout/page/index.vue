<template>
	<RouterView>
		<template #default="{ Component, route }">
			<keep-alive :include="getCaches">
				<component :is="Component" :key="route.fullPath" />
			</keep-alive>
		</template>
	</RouterView>
	<FrameLayout />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import FrameLayout from '../iframe/index.vue';
import { useTabStore } from '../../stores';

export default defineComponent({
	name: 'LtLayoutPage',
	components: { FrameLayout },
	setup() {
		const tabStore = useTabStore();
		// 需要在组件内部设置name
		const getCaches = computed(() => tabStore.getCachedTabList);

		return {
			getCaches,
		};
	},
});
</script>
