<template>
	<LayoutHeader :class="ns.b()">
		<Logo></Logo>
		<div :class="ns.e('right')">
			<Search></Search>
			<UserInfo></UserInfo>
		</div>
	</LayoutHeader>
</template>

<script lang="ts" setup>
import { LayoutHeader } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import Logo from './components/logo.vue';
import UserInfo from './components/user-info.vue';
import Search from './components/search.vue';

const ns = useNamespace('header');
</script>
