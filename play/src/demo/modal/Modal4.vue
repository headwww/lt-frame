<template>
	<LtModal
		v-bind="$attrs"
		@register="register"
		title="Modal Title"
		@visible-change="handleVisibleChange"
	>
		<LtDescription @register="registerD"> </LtDescription>
	</LtModal>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import {
	LtModal,
	useModalInner,
	LtDescription,
	DescItem,
	useDescription,
} from '@lt-frame/components';

const props = defineProps({
	userData: { type: Object },
});
const modelRef = ref({});

const schema: DescItem[] = [
	{
		field: 'data',
		label: 'data',
	},
	{
		field: 'info',
		label: 'info',
	},
];
const [registerD, { setDescProps }] = useDescription({
	title: 'useDescription',
});

const [register] = useModalInner((data) => {
	data && onDataReceive(data);
});

function onDataReceive(data: any) {
	console.log('Data Received', data);
	setDescProps({ schema, data });

	modelRef.value = { field2: data.data, field1: data.info };
}
function handleVisibleChange(v: any) {
	v && props.userData && nextTick(() => onDataReceive(props.userData));
}
</script>
