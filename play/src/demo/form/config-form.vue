<template>
	<LtDivider title="配置表单"></LtDivider>
	<LtForm :data="formData1" :items="formItems" :rules="formRules"> </LtForm>
</template>

<script lang="ts" setup>
import { LtForm, LtDivider, LtFormItems, LtRules } from '@lt-frame/components';
import { reactive, ref } from 'vue';

const formData1 = reactive({
	field1: '文本',
	field2: '12',
});

const formRules: LtRules = {
	field1: [{ required: true }],
};
const formItems = ref<LtFormItems>([
	{
		title: '输入区域',
		span: 12,
		children: [
			{
				field: 'field1',
				title: '文本输入',
				span: 24,
				itemRender: { name: '$input' },
			},
			{
				field: 'field2',
				title: '文本输入',
				span: 24,
				itemRender: { name: '$input-number' },
			},
		],
	},
]);
</script>
