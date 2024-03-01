<script setup lang="ts">
import { ref } from 'vue';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { LTApplication, LTButton } from 'lt-frame';
import { Persistent } from '@lt-frame/utils';

const locale = ref(zhCN);

const handleSetLocal = () => {
	Persistent.setLocal('name', 1111, true);
};
const handleGetLocal = () => {
	console.log(Persistent.getLocal('name'));
};
</script>

<template>
	<LTButton @click="handleSetLocal" color="success"> set </LTButton>
	<LTButton @click="handleGetLocal" color="success"> get </LTButton>

	<a-config-provider :locale="locale">
		<LTApplication> <RouterView /> </LTApplication>
	</a-config-provider>
</template>
