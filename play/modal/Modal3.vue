<template>
	<LTModal @register="register" v-bind="$attrs" title="Modal Title">
		<a-textarea placeholder="textarea with clear icon" allow-clear />

		<p style="height: 10px" v-for="index in 10" :key="index">
			根据屏幕高度自适应
		</p>
	</LTModal>
</template>
<script lang="ts" setup>
import { Textarea as ATextarea } from 'ant-design-vue';
import { useModalInner, LTModal } from '@lt-frame/components';

const [register] = useModalInner();
</script>
