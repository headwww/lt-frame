<template>
	<LtDrawer
		v-bind="$attrs"
		title="Modal Title"
		width="50%"
		showFooter
		@ok="handleOk"
	>
		<p class="h-20" v-for="index in 40" :key="index">根据屏幕高度自适应</p>
		<template #insertFooter>
			<LtButton> btn</LtButton>
		</template>
		<template #centerFooter>
			<LtButton> btn2</LtButton>
		</template>

		<template #appendFooter>
			<LtButton> btn3</LtButton>
		</template>

		<!-- <template #footer>
			<LtButton> customerFooter</LtButton>
		</template> -->
	</LtDrawer>
</template>
<script lang="ts" setup>
import { LtDrawer, LtButton } from '@lt-frame/components';

const handleOk = () => {
	console.log('ok');
	console.log('======================');
};
</script>
