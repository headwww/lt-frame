<template>
	<div>
		<input type="file" @change="handleFileChange" />
	</div>
</template>

<script setup lang="ts">
import { LtHttp } from '@lt-frame/version-1';

const handleFileChange = async (e: Event) => {
	const file = (e.target as HTMLInputElement).files?.[0];
	if (!file) {
		console.error('空文件上传');
		return;
	}

	const formData = new FormData();
	formData.append('file', file);

	try {
		const response = await LtHttp.post<any>({
			url: 'api/commonServiceImpl/uploadFileTest',
			data: [
				{
					name: 'ceshi',
				},
			],
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		console.log(response);
	} catch (error) {
		console.error('File upload failed', error);
	}
};
</script>
