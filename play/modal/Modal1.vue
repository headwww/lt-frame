<template>
	<LTModal
		@register="register"
		title="Main Title"
		:min-height="300"
		tip="提示"
		@open-change="handleShow"
		@ok="handleOk"
	>
		<template #centerFooter>
			<a-button type="primary" danger @click="closeModal">自定义居中</a-button>
		</template>
		<template #insertFooter>
			<a-button type="primary" @click="closeModal">自定义靠前</a-button>
		</template>
		<template #appendFooter>
			<a-button type="primary" @click="closeModal">自定义靠后</a-button>
		</template>
		<div>
			<a-input v-model:value="data1"></a-input>
			<a-button type="primary" danger @click="closeModal">内部关闭</a-button>
			<a-button type="primary" @click="handleOpen">打开窗体</a-button>
		</div>
		<Modal3 @register="register3" />
	</LTModal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Button as AButton, Input as AInput } from 'ant-design-vue';
import { useModal, useModalInner, LTModal } from '@lt-frame/components';
import Modal3 from './Modal3.vue';

const data1 = ref();
const [register3, { openModal }] = useModal();

function handleOpen() {
	openModal(true);
}
const [register, { closeModal, setModalProps }] = useModalInner((data) => {
	data1.value = data.obj;
});
const loading = ref(true);

watch(
	() => data1.value,
	() => {
		setModalProps({ title: data1.value });
	}
);
function handleOk() {
	setModalProps({ confirmLoading: true });
	setTimeout(() => {
		setModalProps({ confirmLoading: false });
	}, 3000);
}
function handleShow(open: boolean) {
	if (open) {
		loading.value = true;
		setModalProps({ loading: true, confirmLoading: true });
		setTimeout(() => {
			loading.value = false;
			setModalProps({ loading: false, confirmLoading: false });
		}, 3000);
	}
}
</script>
