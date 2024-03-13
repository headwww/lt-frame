<template>
	<RouterView>
		<template #default="{ Component, route }">
			<KeepAlive :include="getCaches">
				<component :is="Component" :key="route.fullPath" />
			</KeepAlive>
		</template>
	</RouterView>
	<FrameLayout />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import FrameLayout from '../iframe/index.vue';
import { useTabStore } from '../../stores';

export default defineComponent({
	name: 'LTLayoutPage',
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
