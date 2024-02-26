<template>
	<div>
		<slot name="insertFooter"></slot>
		<LTButton
			v-bind="cancelButtonProps"
			@click="
				(e) => {
					emit('cancel', e);
				}
			"
			v-if="showCancelBtn"
		>
			{{ cancelText }}
		</LTButton>
		<slot name="centerFooter"></slot>
		<LTButton
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
		</LTButton>
		<slot name="appendFooter"></slot>
	</div>
</template>

<script lang="ts" setup>
import { modalFooterProps } from './modal-footer';
import { LTButton } from '../../../button';

defineProps(modalFooterProps);

const emit = defineEmits(['ok', 'cancel']);
</script>
