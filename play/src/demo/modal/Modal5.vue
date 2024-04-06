<template>
	<LtModal v-bind="$attrs" title="Modal Title" width="800px">
		<a-textarea placeholder="textarea with clear icon" allow-clear />

		<div style="height: 20px"></div>
	</LtModal>
</template>
<script lang="ts" setup>
import { Textarea as ATextarea } from 'ant-design-vue';

import { LtModal } from '@lt-frame/components';
</script>
