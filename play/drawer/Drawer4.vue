<template>
	<LTDrawer
		v-bind="$attrs"
		@register="register"
		title="Drawer Title"
		width="50%"
	>
		<div>
			{{ datas }}
		</div>
	</LTDrawer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { LTDrawer } from '@lt-frame/components';
import { useDrawerInner } from '@lt-frame/hooks';

export default defineComponent({
	components: { LTDrawer },
	setup() {
		const datas = ref();
		const [register] = useDrawerInner((data) => {
			// 方式1
			datas.value = data;
		});
		return { register, datas };
	},
});
</script>
