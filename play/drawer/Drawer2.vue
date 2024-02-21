<template>
	<LTDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		Drawer Info.
		<a-button type="primary" @click="closeDrawer"> 内部关闭drawer </a-button>
	</LTDrawer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { LTDrawer, LTButton as AButton } from '@lt-frame/components';
import { useDrawerInner } from '@lt-frame/hooks';

export default defineComponent({
	components: { LTDrawer, AButton },
	setup() {
		const [register, { closeDrawer }] = useDrawerInner();
		return { register, closeDrawer };
	},
});
</script>
