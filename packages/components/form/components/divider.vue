<template>
	<div :class="ns.b()">
		<slot></slot>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';

const ns = useNamespace('form-divider ');
</script>
