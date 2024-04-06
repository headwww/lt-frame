<template>
	<div v-if="showFrame">
		<template v-for="frame in getFramePages" :key="frame.path">
			<FramePage
				v-if="frame.meta.frameSrc && hasRenderFrame(frame.name)"
				:frameSrc="frame.meta.frameSrc"
				v-show="showIframe(frame)"
			/>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { uniqBy } from 'lodash-es';
import { computed, toRaw, unref } from 'vue';
import { useRouter } from 'vue-router';
import FramePage from '../../view/iframe/index.vue';
import { useTabStore } from '../../stores';
import { LtRouteRecordRaw } from '../../router';

const router = useRouter();
const { currentRoute } = router;
const tabStore = useTabStore();

const showFrame = computed(() => unref(getFramePages).length > 0);

const getOpenTabList = computed((): string[] =>
	tabStore.getTabList.reduce((prev: string[], next) => {
		if (next.meta && Reflect.has(next.meta, 'frameSrc')) {
			prev.push(next.name as string);
		}
		return prev;
	}, [])
);

function hasRenderFrame(name: string) {
	return unref(getOpenTabList).includes(name);
}

function showIframe(item: LtRouteRecordRaw) {
	return item.name === unref(currentRoute).name;
}

// 获取需要内嵌在项目中的外部地址的路由信息
const getFramePages = computed(() => {
	const ret =
		getAllFramePages(
			toRaw(router.getRoutes()) as unknown as LtRouteRecordRaw[]
		) || [];
	return ret;
});

function getAllFramePages(routes: LtRouteRecordRaw[]): LtRouteRecordRaw[] {
	let res: LtRouteRecordRaw[] = [];
	for (const route of routes) {
		const { meta: { frameSrc } = {}, children } = route;
		if (frameSrc) {
			res.push(route);
		}
		if (children && children.length) {
			res.push(...getAllFramePages(children));
		}
	}
	res = uniqBy(res, 'name');
	return res;
}
</script>
