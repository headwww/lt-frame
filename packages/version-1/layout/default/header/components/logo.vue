<template>
	<div :class="ns.b()">
		<div style="width: 130px; cursor: pointer">
			<LTSvgIcon name="logo-with-text" size="132"></LTSvgIcon>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LTSvgIcon } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';

const ns = useNamespace('header-logo');
</script>
