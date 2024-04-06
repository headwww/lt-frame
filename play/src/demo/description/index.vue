<template>
	<LtPageLayout title="详情组件">
		<LtDescription title="基础实例" :schema="schema" :data="data">
			<template #extra>
				<LtButton color="error"> 错误 </LtButton>
			</template>
		</LtDescription>
		<LtDescription
			style="margin-top: 20px"
			:column="3"
			bordered
			title="带边框垂直的表格"
			:schema="schema"
			:data="data"
			layout="vertical"
		></LtDescription>
		<LtDescription @register="register" />
		<LtDescription @register="register1" />
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	LtPageLayout,
	LtDescription,
	DescItem,
	LtButton,
} from '@lt-frame/components';
import { useDescription } from '@lt-frame/hooks';
import { reactive } from 'vue';

const data = reactive({
	field1: 'tom',
	field2: '98',
	field3: 'field3',
	field4: 'phone',
});

const schema: DescItem[] = [
	{
		field: 'field1',
		label: '自定义label样式',
		contentMinWidth: 2,
		render: (val) => `自定义渲染-${val}`,
		show: () => true,
		labelStyle: {
			color: '#3370ff',
		},
		isCopyEnabled: true,
	},
	{
		field: 'field2',
		label: '复制',
	},
	{
		field: 'field3',
		label: 'tip',
		isTip: true,
		tip: '提示内容',
	},
	{
		field: 'field4',
		label: '自定义field样式',
		fieldStyle: {
			color: '#3370ff',
		},
	},
];

const [register] = useDescription({
	title: 'useDescription',
	data,
	schema,
});

const [register1] = useDescription({
	title: '无边框',
	bordered: false,
	data,
	schema,
});
</script>
