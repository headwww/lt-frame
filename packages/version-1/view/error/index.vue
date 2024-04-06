<template>
	<div :class="ns.b()">
		<div :class="ns.e('empty-placeholder')">
			<LtSvgIcon name="default-page-no-access" size="180"></LtSvgIcon>
			<span style="color: #8f959e; font-size: 14px; margin-top: 15px"
				>你没有访问该功能的权限，如需操作请联系管理员为你添加权限</span
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LtSvgIcon } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';

const ns = useNamespace('error-page');
</script>
