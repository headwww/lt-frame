<template>
	<LtPageLayout title="虚拟滚动">
		<a-alert style="margin: 10px" message="固定尺寸的" />

		<a-button @click="recycleScroller.scrollToItem(20)">跳转到指定项</a-button>
		<a-button @click="recycleScroller.scrollToPosition(200)"
			>跳转到指像素</a-button
		>
		<LtRecycleScroller
			ref="recycleScroller"
			@visible="visible"
			@hidden="hidden"
			@resize="resize"
			style="margin-top: 10px; height: 300px"
			:items="items"
			:itemClass="['scroller']"
			:itemSize="60"
		>
			<template #before>
				<div>bef11ore</div>
			</template>
			<template #default="{ item }">
				<div
					style="
						height: 50px;
						width: 100%;
						background-color: #d6e6f8;
						border-radius: 6px;
						line-height: 50px;
						text-align: center;
						margin: 5px;
					"
				>
					{{ item }}
				</div>
			</template>
			<template #after>
				<div>after</div>
			</template>
		</LtRecycleScroller>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Alert as AAlert } from 'ant-design-vue';
import {
	LtPageLayout,
	LtButton as AButton,
	LtRecycleScroller,
} from '@lt-frame/components';

const items: any = ref([]);
const recycleScroller = ref();

for (let i = 0; i < 2000; i += 1) {
	items.value.push({ view: i, id: `id${i}` });
}
function hidden() {
	//
}
function resize() {
	//
}
function visible() {
	//
}
</script>

<style lang="scss" scoped>
::v-deep(.scroller) {
	width: 100%;
}

/* stylelint-disable-next-line selector-class-pattern */
::v-deep(.lt-recycle-scroller__item-view.hover) {
	background: #4fc08d;
}
</style>
