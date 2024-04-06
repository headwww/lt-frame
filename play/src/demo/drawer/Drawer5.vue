<template>
	<LtDrawer v-bind="$attrs" @register="register" title="Drawer Title" isDetail>
		<LtDescription @register="registerD"> </LtDescription>
	</LtDrawer>
</template>
<script lang="ts" setup>
import { LtDrawer, LtDescription, DescItem } from '@lt-frame/components';
import { useDescription, useDrawerInner } from '@lt-frame/hooks';

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
