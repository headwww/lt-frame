<template>
	<div></div>
</template>

<script lang="ts" setup>
import { parse } from '@lt-frame/utils';
import { LtHttp } from '@lt-frame/version-1';

LtHttp.post(
	{
		url: 'api/securityModelService/findUsers',
		data: [
			{
				targetClass: 'lt.fw.core.model.biz.User',
				queryPath: [
					'username',
					'corp.name',
					'corp.id',
					'corp.code',
					'createdBy',
				],
			},
		],
	},
	{
		isTransformResponse: false,
		fastjson: false,
	}
)
	.then((data) => {
		console.log(data);
		console.log(parse(data));
	})
	.catch(() => {});
</script>
