<template>
	<div style="position: relative">
		<div
			style="
				border: #000 solid 1px;
				width: 100px;
				height: 100px;
				position: absolute;
			"
			:style="{
				width: style.width + 'px',
				height: style.height + 'px',
				transform: style.transform,
			}"
		></div>
		<div
			ref="divRef"
			style="border: 1px solid #000; width: 500px; height: 500px; display: flex"
			@mousedown="mousedown"
			@click="click"
		>
			<div style="background-color: #e0e0e0; width: 150px; height: 150px"></div>
			<div style="background-color: aqua; width: 100px; height: 100px"></div>
			<div style="background-color: #ee9527; width: 130px; height: 130px"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const divRef = ref<HTMLDivElement>();
function click() {
	console.log('click');
}

const style = reactive({
	width: 0,
	height: 0,
	transform: 'translate(0px, 0px)',
});
function mousedown(e: MouseEvent) {
	const target = e.target as HTMLElement; // 将 target 转换为 HTMLElement
	console.log(e);

	const rect = target.getBoundingClientRect(); // 获取元素的位置信息和尺寸

	const distanceX = rect.left - divRef.value!!.getBoundingClientRect().left; // 水平距离
	const distanceY = rect.top - divRef.value!!.getBoundingClientRect().top; // 垂直距离

	style.height = rect.height;
	style.width = rect.width;
	style.transform = `translate(${distanceX}px,${distanceY}px)`;
	console.log(rect);
}
</script>
