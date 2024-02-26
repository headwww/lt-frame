<template>
	<div style="background-color: #fff; font-size: 20px; padding: 20px">
		<a-alert style="margin-bottom: 10px" message="Modal组件实例" />

		<div style="margin-top: 20px">
			<a-button @click="handleModal1" type="primary">打开窗体</a-button>
			<div>v-model:open={{ open1 }}</div>
			<div>getOpen={{ getOpen1 }}</div>
			<a-input v-model:value="data1"></a-input>
			<a-button
				@click="
					() => {
						openModal3();
					}
				"
				type="primary"
				>自适应高度</a-button
			>
		</div>
		<a-button @click="openTargetModal" type="primary"
			>动态组件方式打开modal</a-button
		>
		<Modal1
			@open-change="changeOpen1"
			v-model:open="open1"
			@register="register"
		/>
		<component
			:is="currentModal"
			v-model:open="modalOpen"
			:userData="userData"
		/>

		<Modal3 @register="register3" />
	</div>
</template>

<script lang="ts" setup>
import { ref, shallowRef } from 'vue';
import {
	Alert as AAlert,
	Button as AButton,
	Input as AInput,
} from 'ant-design-vue';
import { useMessage } from '@lt-frame/hooks';
import { useModal } from '@lt-frame/components';
import Modal1 from './Modal1.vue';
import Modal3 from './Modal3.vue';
import Modal2 from './Modal2.vue';

const modalOpen = ref(false);
const userData = ref<any>(null);

const currentModal = shallowRef();

function openTargetModal() {
	currentModal.value = Modal2;

	userData.value = { data: Math.random(), info: 'Info222' };
	modalOpen.value = true;
}
const open1 = ref(false);
const data1 = ref('传递数据到modal');

const { createMessage } = useMessage();

const [register, { openModal: openModal1, getOpen: getOpen1 }] = useModal();
const [register3, { openModal: openModal3 }] = useModal();

const handleModal1 = () => {
	openModal1(true, { obj: data1 });
};
const changeOpen1 = (v: boolean) => {
	createMessage.success(`@open-change监听打开状态=${v}`);
};
</script>
