<template>
	<div :class="ns.b()">
		<div :class="ns.e('svg')">
			<LTSvgIcon
				style="cursor: pointer; height: 40px"
				name="logo-with-text"
				size="132"
			></LTSvgIcon>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LTSvgIcon } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';

const ns = useNamespace('header-logo');
</script>
