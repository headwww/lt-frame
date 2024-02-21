<template>
	<div v-if="!isDetail" :class="ns.b()">
		{{ title }}
	</div>
	<div v-else :class="ns.b()">
		<span :class="ns.b('twrap')">
			<span @click="handleClose" v-if="showDetailBack">
				<ArrowLeftOutlined :class="ns.b('back')" />
			</span>
			<span v-if="title">{{ title }}</span>
		</span>
		<span :class="ns.b('toolbar')">
			<slot name="titleToolbar"></slot>
		</span>
	</div>
</template>

<script lang="ts" setup>
import { ArrowLeftOutlined } from '@ant-design/icons-vue';
import { useNamespace } from '@lt-frame/hooks';
import { drawerHeaderProps } from './drawer-header';

defineProps(drawerHeaderProps);

const ns = useNamespace('drawer-header');

const emit = defineEmits(['close']);

function handleClose() {
	emit('close');
}
</script>
