<template>
	<LTModal @register="register" v-bind="$attrs" title="Modal Title">
		<a-textarea placeholder="textarea with clear icon" allow-clear />

		<p style="height: 10px" v-for="index in 10" :key="index">
			根据屏幕高度自适应
		</p>
	</LTModal>
</template>
<script lang="ts" setup>
import { useModalInner, LTModal } from '@lt-frame/components';

import { useMessage } from '@lt-frame/hooks';

const { createMessage } = useMessage();
const props = defineProps({
	userData: { type: Object },
});
createMessage.success(`传递过来的数据${(props.userData as any).info}`);

const [register] = useModalInner();
</script>
