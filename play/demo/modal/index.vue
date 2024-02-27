<template>
	<LTPageLayout title="Modal组件使用示例">
		<Alert
			message="使用 useModal 进行弹窗操作，默认可以拖动，可以通过 draggable
    参数进行控制是否可以拖动/全屏，并演示了在Modal内动态加载内容并自动调整高度"
			show-icon
		/>
		<a-button type="primary" class="my-4" @click="openModalLoading">
			打开弹窗,加载动态数据并自动调整高度(默认可以拖动/全屏)
		</a-button>

		<Alert message="内外同时同时显示隐藏" show-icon />
		<a-button type="primary" class="my-4" @click="openModal2">
			打开弹窗
		</a-button>

		<Modal1 @register="register1" :minHeight="100" />
		<Modal2 @register="register2" />
	</LTPageLayout>
</template>

<script setup lang="ts">
import { LTPageLayout, LTButton as AButton, useModal } from 'lt-frame';
import { Alert } from 'ant-design-vue';
import { unref, watch } from 'vue';
import Modal1 from './Modal1.vue';

const [register1, { openModal: openModal1, getOpen: getOpen1 }] = useModal();
const [register2, { openModal: openModal2 }] = useModal();

function openModalLoading() {
	openModal1(true);
}

watch(
	() => unref(getOpen1),
	() => {
		console.log(getOpen1?.value);
	}
);
</script>
