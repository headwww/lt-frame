<template>
	<LTDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		Drawer Info.
		<LTButton type="primary" @click="closeDrawer"> 内部关闭drawer </LTButton>
	</LTDrawer>
</template>

<script setup lang="ts">
import { LTDrawer, useDrawerInner, LTButton } from 'lt-frame';

const [register, { closeDrawer }] = useDrawerInner();
</script>
