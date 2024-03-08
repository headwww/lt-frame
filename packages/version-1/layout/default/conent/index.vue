<template>
	<LayoutContent :class="ns.b()">
		<PageLayout />
	</LayoutContent>
</template>

<script lang="ts" setup>
import { LayoutContent } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import PageLayout from '../../page/index.vue';

const ns = useNamespace('layout-content');
</script>
