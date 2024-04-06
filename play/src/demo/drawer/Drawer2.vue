<template>
	<LtDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		Drawer Info.
		<LtButton type="primary" @click="closeDrawer"> 内部关闭drawer </LtButton>
	</LtDrawer>
</template>

<script setup lang="ts">
import { LtDrawer, LtButton } from '@lt-frame/components';
import { useDrawerInner } from '@lt-frame/hooks';

const [register, { closeDrawer }] = useDrawerInner();
</script>
