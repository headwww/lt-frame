<script setup lang="ts">
import { ref } from 'vue';
import { ConfigProvider as AConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { LtApplication } from '@lt-frame/components';

const locale = ref(zhCN);
</script>

<template>
	<a-config-provider :locale="locale">
		<LtApplication>
			<RouterView />
		</LtApplication>
	</a-config-provider>
</template>
