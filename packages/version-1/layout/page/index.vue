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
import { computed, defineComponent, onUnmounted } from 'vue';
import FrameLayout from '../iframe/index.vue';
import { useTabStore } from '../../stores';
import { LtHttp } from '../../configs';

export default defineComponent({
	name: 'LtLayoutPage',
	components: { FrameLayout },
	setup() {
		const tabStore = useTabStore();
		// 需要在组件内部设置name
		const getCaches = computed(() => tabStore.getCachedTabList);

		/** 心跳保持登录 */
		const ping = setInterval(async () => {
			// 定时器执行的代码
			LtHttp.get(
				{
					url: '/ping',
				},
				{ errorMessageMode: 'none' }
			);
		}, 15000);

		onUnmounted(() => {
			clearInterval(ping);
		});

		return {
			getCaches,
		};
	},
});
</script>
