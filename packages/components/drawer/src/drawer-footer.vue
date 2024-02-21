<template>
	<div :class="ns.b()" :style="getStyle" v-if="showFooter || $slots.footer">
		<template v-if="!$slots.footer">
			<slot name="insertFooter"></slot>
			<LTButton
				v-bind="cancelButtonProps"
				@click="handleClose"
				v-if="showCancelBtn"
			>
				{{ cancelText }}
			</LTButton>
			<slot name="centerFooter"></slot>
			<LTButton
				:type="okType"
				@click="handleOk"
				v-bind="okButtonProps"
				:loading="confirmLoading"
				v-if="showOkBtn"
			>
				{{ okText }}
			</LTButton>
			<slot name="appendFooter"></slot>
		</template>

		<template v-else>
			<slot name="footer"></slot>
		</template>
	</div>
</template>
<script lang="ts" setup>
import type { CSSProperties } from 'vue';
import { computed } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import { LTButton } from '../../button';
import { drawerFooterProps } from './drawer-footer';

const ns = useNamespace('drawer-footer');

const props = defineProps({
	...drawerFooterProps,
	height: {
		type: String,
		default: '60px',
	},
});

const emit = defineEmits(['ok', 'close']);

const getStyle = computed((): CSSProperties => {
	const heightStr = `${props.height}`;
	return {
		height: heightStr,
		lineHeight: `calc(${heightStr} - 1px)`,
	};
});

function handleOk() {
	emit('ok');
}

function handleClose() {
	emit('close');
}
</script>
