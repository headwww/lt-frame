<template>
	<LtModal :width="800" :title="'详情'" v-bind="$attrs">
		<template v-if="info">
			<LtDescription bordered :data="info" @register="register" />
		</template>
	</LtModal>
</template>

<script lang="ts" setup>
import { LtDescription, LtModal } from '@lt-frame/components';
import { PropType } from 'vue';
import { useDescription } from '@lt-frame/hooks';

defineProps({
	info: {
		type: Object as PropType<any>,
	},
});

const [register] = useDescription({
	column: 2,
	schema: [
		{
			field: 'type',
			label: '类型',
		},
		{
			field: 'url',
			label: 'URL',
			isCopyEnabled: true,
		},
		{
			field: 'time',
			label: '时间',
		},
		{
			field: 'file',
			label: '文件',
		},
		{
			field: 'name',
			label: 'Name',
		},
		{
			field: 'message.message',
			label: '错误信息',
			isCopyEnabled: true,
		},
		{
			field: 'stack',
			label: 'stack信息',
			isCopyEnabled: true,
		},
	],
});
</script>
