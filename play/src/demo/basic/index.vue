<template>
	<LtPageLayout title="带箭头的组件">
		<LtArrow @click="expand = !expand" :expand="!expand"></LtArrow>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtArrow } from '@lt-frame/components';
import { ref } from 'vue';

const expand = ref(false);
</script>
