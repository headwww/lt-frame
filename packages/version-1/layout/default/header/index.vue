<template>
	<div :class="ns.b()">
		<div :class="ns.e('left')">
			<Logo></Logo>
		</div>
		<div :class="ns.e('right')"></div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import Logo from './components/logo.vue';

const ns = useNamespace('layout-header');
</script>
