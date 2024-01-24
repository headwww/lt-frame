<template>
	<div>
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
</template>
<script setup lang="ts">
import { useMessage } from 'lt-frame';

const { notification } = useMessage();
</script>
