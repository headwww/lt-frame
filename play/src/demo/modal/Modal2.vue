<template>
	<LTModal
		@register="register"
		title="Modal Title"
		:helpMessage="['提示1', '提示2']"
		:okButtonProps="{ disabled: true } as ButtonProps"
	>
		<a-button type="primary" @click="closeModal" class="mr-2">
			从内部关闭弹窗
		</a-button>
		<a-button
			type="primary"
			@click="
				() => {
					setModalProps({ title: 'Modal New Title' });
				}
			"
		>
			从内部修改title
		</a-button>
	</LTModal>
</template>
<script lang="ts" setup>
import {
	LTModal,
	LTButton as AButton,
	useModalInner,
	ButtonProps,
} from '@lt-frame/components';

const [register, { closeModal, setModalProps }] = useModalInner();
</script>
