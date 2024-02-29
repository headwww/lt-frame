<script setup lang="ts">
import { ref } from 'vue';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { LTApplication } from 'lt-frame';

const locale = ref(zhCN);
</script>

<template>
	<a-config-provider :locale="locale">
		<LTApplication> <RouterView /> </LTApplication>
	</a-config-provider>
</template>
