<template>
	<div :class="ns.b()">
		<div :class="ns.e('header')">
			<div :class="ns.e('header-left')">
				<div :class="ns.e('header-left-logo')">
					<LTSvgIcon name="ltscm" size="80"></LTSvgIcon>
				</div>
				<div :class="ns.e('header-left-title')">欢迎使用</div>
			</div>
		</div>
		<a-form
			:model="formState"
			name="normal_login"
			layout="vertical"
			@finish="onFinish"
		>
			<a-form-item name="username">
				<template #label>
					<span class="input-label">请输入账户</span>
				</template>
				<a-input style="height: 40px" v-model:value="formState.username">
					<template #prefix>
						<UserOutlined />
					</template>
				</a-input>
			</a-form-item>

			<a-form-item name="password">
				<template #label>
					<span class="input-label">请输入密码</span>
				</template>
				<a-input-password
					style="height: 40px"
					v-model:value="formState.password"
				>
					<template #prefix>
						<LockOutlined />
					</template>
				</a-input-password>
			</a-form-item>

			<a-form-item>
				<a-button
					style="height: 40px; width: 100%; margin-top: 20px"
					:disabled="disabled"
					type="primary"
					html-type="submit"
					:loading="isLoading"
				>
					登录
				</a-button>
			</a-form-item>
		</a-form>
	</div>
</template>
<script lang="ts" setup>
import {
	Button as AButton,
	Form as AForm,
	FormItem as AFormItem,
	InputPassword as AInputPassword,
	Input as AInput,
} from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { ref, reactive, computed } from 'vue';
import { useMessage, useNamespace } from '@lt-frame/hooks';
import { LTSvgIcon } from '@lt-frame/components';
import { useUserStore } from '../../stores/user';

const ns = useNamespace('login-form');
const { notification, createErrorModal } = useMessage();

const userStore = useUserStore();
const isLoading = ref(false);

const formState = reactive({
	username: '',
	password: '',
});

const disabled = computed(() => !(formState.username && formState.password));

const onFinish = async (values: any) => {
	isLoading.value = true;
	try {
		const userInfo = await userStore.login(values.username, values.password);
		isLoading.value = false;
		if (userInfo) {
			notification.success({
				message: '登录成功',
				description: `欢迎回来`,
				duration: 2,
			});
		}
	} catch (error) {
		createErrorModal({
			title: '错误提示',
			content:
				(error as unknown as Error).message ||
				'网络异常，请检查您的网络连接情况',
		});
		isLoading.value = false;
	}
};
</script>
