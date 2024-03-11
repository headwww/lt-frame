<template>
	<div :class="ns.b()">
		<div :class="ns.e('logo')">
			<Logo></Logo>
		</div>
		<div :class="ns.e('right')">
			<UserInfo></UserInfo>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import Logo from './components/logo.vue';
import UserInfo from './components/user-info.vue';

const ns = useNamespace('layout-header');
</script>
