<template>
	<LtDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		<LtDescription @register="registerD"> </LtDescription>
	</LtDrawer>
</template>
<script lang="ts" setup>
import {
	LtDrawer,
	LtDescription,
	DescItem,
	useDrawerInner,
	useDescription,
} from '@lt-frame/components';

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
