<template>
	<LtDivider title="基础表单"></LtDivider>
	<LtForm
		:data="formData1"
		:rules="{
			name: [{ required: true }],
		}"
	>
		<LtFormItem span="12" title="标签1" field="name" :item-render="{}">
			<template #default="{ data }">
				<Input class="valid" v-model:value="data.name"></Input>
			</template>
		</LtFormItem>
		<LtFormItem title="标签1" span="12" :item-render="{}">
			<template #default="params">
				<Button @click="handle(params)">提交</Button>
			</template>
		</LtFormItem>
	</LtForm>
</template>

<script lang="ts" setup>
import { LtForm, LtFormItem, LtDivider } from '@lt-frame/components';
import { reactive } from 'vue';
import { Button, Input } from 'ant-design-vue';

const formData1 = reactive({
	name: '12',
});

function handle(data: any) {
	console.log(formData1, data);
}
</script>
