<template>
	<LTModal
		v-bind="$attrs"
		@register="register"
		title="Modal Title"
		@visible-change="handleVisibleChange"
	>
		<LTDescription @register="registerD"> </LTDescription>
	</LTModal>
</template>
<script lang="ts" setup>
import { nextTick, ref } from 'vue';
import {
	LTModal,
	useModalInner,
	LTDescription,
	DescItem,
} from '@lt-frame/components';
import { useDescription } from '@lt-frame/hooks';

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
