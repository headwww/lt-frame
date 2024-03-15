<template>
	<LTPageLayout title="带箭头的组件">
		<LTArrow @click="expand = !expand" :expand="!expand"></LTArrow>
	</LTPageLayout>
</template>

<script setup lang="ts">
import { LTPageLayout, LTArrow } from '@lt-frame/components';
import { ref } from 'vue';

const expand = ref(false);
</script>
