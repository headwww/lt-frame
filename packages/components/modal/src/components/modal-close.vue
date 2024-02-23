<template>
	<div :class="getClass">
		<template v-if="canFullscreen">
			<Tooltip title="还原" placement="bottom" v-if="fullScreen">
				<FullscreenExitOutlined @click="handleFullScreen" />
			</Tooltip>
			<Tooltip title="最大化" placement="bottom" v-else>
				<FullscreenOutlined @click="handleFullScreen" />
			</Tooltip>
		</template>

		<Tooltip title="关闭" placement="bottom">
			<CloseOutlined @click="handleCancel" />
		</Tooltip>
	</div>
</template>

<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue';
import {
	CloseOutlined,
	FullscreenOutlined,
	FullscreenExitOutlined,
} from '@ant-design/icons-vue';
import { computed } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import { modalColseProps } from './modal-close';

const emit = defineEmits(['cancel', 'fullscreen']);

const props = defineProps(modalColseProps);

const ns = useNamespace('modal-close');

const getClass = computed(() => [
	ns.b(),
	ns.m('custom'),
	{
		[`${ns.m('can-full')}`]: props.canFullscreen,
	},
]);

function handleCancel(e: Event) {
	emit('cancel', e);
}

function handleFullScreen(e: Event) {
	e?.stopPropagation();
	e?.preventDefault();
	emit('fullscreen');
}
</script>
