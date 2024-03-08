<template>
	<LayoutSider :class="ns.b()" :collapsedWidth="52" :width="244"> </LayoutSider>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { LayoutSider } from 'ant-design-vue';

const ns = useNamespace('layout-sider');
</script>
