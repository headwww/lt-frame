<template>
	<LTPageLayout
		dense
		title="Scrollbar 滚动条"
		content="用于替换浏览器原生滚动条。"
		:content-style="{ backgroundColor: '#FFF' }"
	>
		<a-alert
			style="margin: 10px"
			message="通过 height 属性设置滚动条高度，若不设置则根据父容器高度自适应。"
		/>
		<LTScrollbar
			style="width: 600px; margin: auto; padding: 15px"
			height="300px"
		>
			<p v-for="item in 20" :key="item" class="scrollbar-demo-item1">
				{{ item }}
			</p>
		</LTScrollbar>

		<a-alert
			style="margin: 10px"
			message="横向滚动 当元素宽度大于滚动条宽度时，会显示横向滚动条。"
		/>

		<LTScrollbar>
			<div class="scrollbar-flex-content2">
				<p v-for="item in 50" :key="item" class="scrollbar-demo-item2">
					{{ item }}
				</p>
			</div>
		</LTScrollbar>

		<a-button @click="count += 1">Add Item</a-button>
		<a-button @click="count -= 1">Delete Item</a-button>
		<LTScrollbar max-height="400px" always>
			<p v-for="item in count" :key="item" class="scrollbar-demo-item1">
				{{ item }}
			</p>
		</LTScrollbar>
		<a-button @click="scrollbarRef?.setScrollTop(0)">滚动到顶部</a-button>
		>
		<a-button @click="scrollbarRef?.setScrollTop(600)">滚动到600px</a-button>
		<a-button @click="scrollbarRef?.scrollBottom()">滚动到底部</a-button>
		<LTScrollbar ref="scrollbarRef" height="300px">
			<p v-for="item in 20" :key="item" class="scrollbar-demo-item1">
				{{ item }}
			</p>
		</LTScrollbar>
		<a-button @click="scrollbarRef2?.setScrollTop(0)">滚动到顶部</a-button>
		<a-button @click="scrollbarRef2?.setScrollTop(500)"
			>滚动到500px，关闭滚动效果,scroll-animation-off</a-button
		>
		<LTScrollbar scroll-animation-off ref="scrollbarRef2" height="300px">
			<p v-for="item in 20" :key="item" class="scrollbar-demo-item1">
				{{ item }}
			</p>
		</LTScrollbar>
	</LTPageLayout>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Alert as AAlert } from 'ant-design-vue';
import { LTPageLayout, LTScrollbar, LTButton as AButton } from 'lt-frame';

const count = ref(3);

const scrollbarRef = ref<InstanceType<typeof LTScrollbar>>();
const scrollbarRef2 = ref<InstanceType<typeof LTScrollbar>>();
</script>

<style scoped>
.scrollbar-demo-item1 {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 50px;
	margin: 10px;
	text-align: center;
	border-radius: 4px;
	background: #d6e6f8;
	color: #000;
}

.scrollbar-flex-content2 {
	display: flex;
}

.scrollbar-demo-item2 {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100px;
	height: 50px;
	margin: 10px;
	text-align: center;
	border-radius: 4px;
	background: rgb(255 236 236);
	color: var(--el-color-danger);
}
</style>
