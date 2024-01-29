<template>
	<div>
		<Test></Test>
		<button
			@click="
				notification.info({
					message: '成功',
					description: `欢迎`,
					duration: 2,
				})
			"
		>
			info
		</button>
	</div>
	<SvgIcon></SvgIcon>
</template>
<script setup lang="ts">
import { useMessage } from 'lt-frame';
import { SvgIcon } from '@lt-frame/components';

const { notification } = useMessage();
</script>
