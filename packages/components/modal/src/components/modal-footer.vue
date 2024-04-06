<template>
	<div>
		<slot name="insertFooter"></slot>
		<LtButton
			v-bind="cancelButtonProps"
			@click="
				(e) => {
					emit('cancel', e);
				}
			"
			v-if="showCancelBtn"
		>
			{{ cancelText }}
		</LtButton>
		<slot name="centerFooter"></slot>
		<LtButton
			:type="okType"
			@click="
				(e) => {
					emit('ok', e);
				}
			"
			:loading="confirmLoading"
			v-if="showOkBtn"
			v-bind="okButtonProps"
		>
			{{ okText }}
		</LtButton>
		<slot name="appendFooter"></slot>
	</div>
</template>

<script lang="ts" setup>
import { modalFooterProps } from './modal-footer';
import { LtButton } from '../../../button';

defineProps(modalFooterProps);

const emit = defineEmits(['ok', 'cancel']);
</script>
