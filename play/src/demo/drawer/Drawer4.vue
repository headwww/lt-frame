<template>
	<LTDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		<LTDescription @register="registerD"> </LTDescription>
	</LTDrawer>
</template>
<script lang="ts" setup>
import {
	LTDrawer,
	LTDescription,
	DescItem,
	useDescription,
	useDrawerInner,
} from 'lt-frame';

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

const [register] = useDrawerInner((data) => {
	setDescProps({ schema, data });
});
</script>
