<template>
	<div>
		<LtDivider title="垂直表单"></LtDivider>

		<lt-form
			ref="formRef"
			vertical
			:data="formData"
			:rules="formRules"
			@submit="submitEvent"
			@reset="resetEvent"
		>
			<lt-form-item title="名称" field="name" span="24">
				<template #default="{ data }">
					<Input class="valid" v-model:value="data.name"></Input>
				</template>
			</lt-form-item>
			<lt-form-item
				title="下拉框"
				field="sex"
				span="24"
				:item-render="{}"
				title-overflow
			>
				<template #default="params">
					<vxe-select
						v-model="params.data.sex"
						placeholder="请选择性别"
						clearable
						@change="changeEvent(params)"
					>
						<vxe-option value="1" label="女"></vxe-option>
						<vxe-option value="2" label="男"></vxe-option>
					</vxe-select>
				</template>
			</lt-form-item>
			<lt-form-item align="center" span="24">
				<template #default>
					<lt-button html-type="submit" type="primary">提交</lt-button>
					<lt-button html-type="reset">重置</lt-button>
				</template>
			</lt-form-item>
		</lt-form>
	</div>
</template>

<script lang="ts" setup>
import {
	LtForm,
	LtFormItem,
	Rules,
	LtButton,
	LtFormInstance,
	LtDivider,
} from '@lt-frame/components';
import { Input } from 'ant-design-vue';
import { ref } from 'vue';

const formRef = ref<LtFormInstance>();

const formData = ref({
	name: 'test1',
	nickname: 'Testing',
	sex: '1',
});
const changeEvent = (params: any) => {
	const $form = formRef.value;
	if ($form) {
		$form.updateStatus(params);
	}
};
const formRules = ref<Rules>({
	name: [
		{ required: true, content: '请输入名称' },
		{ min: 3, max: 5, content: '长度在 3 到 5 个字符' },
	],
	sex: [{ required: true, content: '请选择性别' }],
});

const submitEvent = () => {
	console.log('保存成功', formData.value);
};

const resetEvent = () => {
	console.log('重置事件');
};
</script>
