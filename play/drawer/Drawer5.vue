<template>
	<LTDrawer v-bind="$attrs" :isDetail="true" title="Drawer Title5">
		<p class="h-20">Content Message</p>
		<template #titleToolbar> toolbar </template>
	</LTDrawer>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { LTDrawer } from '@lt-frame/components';

export default defineComponent({
	components: { LTDrawer },
});
</script>
