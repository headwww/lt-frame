<template>
	<LTDrawer
		v-bind="$attrs"
		title="Modal Title"
		width="50%"
		showFooter
		@ok="handleOk"
	>
		<p class="h-20" v-for="index in 40" :key="index">根据屏幕高度自适应</p>
		<template #insertFooter>
			<LTButton> btn</LTButton>
		</template>
		<template #centerFooter>
			<LTButton> btn2</LTButton>
		</template>

		<template #appendFooter>
			<LTButton> btn3</LTButton>
		</template>

		<!-- <template #footer>
			<LTButton> customerFooter</LTButton>
		</template> -->
	</LTDrawer>
</template>
<script lang="ts" setup>
import { LTDrawer, LTButton } from '@lt-frame/components';

const handleOk = () => {
	console.log('ok');
	console.log('======================');
};
</script>
