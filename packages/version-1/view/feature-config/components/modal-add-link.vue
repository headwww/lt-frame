<!--
 * @Description: 新增一个vue链接
 * @Author: sw
-->
<template>
	<LtModal
		v-model:open="mOpen"
		title="链接设置"
		width="600px"
		@ok="onOk"
		destroy-on-close
		:ok-button-props="{
			disabled: getDisable,
		}"
	>
		<div style="height: 360px">
			<span style="color: #646a73; margin-bottom: 10px"
				>可添加任意网页链接，如报表、文档、外部链接等</span
			>

			<Form layout="vertical" :model="formState" :rules="rules">
				<FormItem
					tooltip="输入路径单独的单词即可，不可以出现中文，不可以出现/\%@#&*()^等特殊字符"
					label="路径"
					name="path"
				>
					<Input placeholder="请填写路径" v-model:value="formState.path" />
				</FormItem>
				<FormItem label="链接地址" name="frameSrc">
					<Input
						placeholder="请填写 HTTP 或 HTTPS 地址"
						v-model:value="formState.frameSrc"
					/>
				</FormItem>
				<FormItem label="展示名称" name="title">
					<Input
						placeholder="请填写链接展示名称"
						v-model:value="formState.title"
					/>
				</FormItem>
				<FormItem label="打开方式" name="isExternalLink">
					<Switch v-model:checked="formState.isExternalLink" />
					<span style="line-height: 22px; margin-left: 6px; color: #646a73"
						>{{ formState.isExternalLink ? '外部打开' : '内置打开' }}
					</span>
				</FormItem>
			</Form>
		</div>
	</LtModal>
</template>

<script setup lang="ts">
import { Form, FormItem, Input, Switch } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { LtModal } from '@lt-frame/components';
import { computed, PropType, ref, watch } from 'vue';
import { isUndefined } from 'lodash-es';
import { FeatureConfig } from '../../../types';
import { validatorPath, validatorSpecialChars, validatorURL } from './utils';

defineOptions({
	name: 'ModalAddLink',
	inheritAttrs: false,
});

const props = defineProps({
	edit: Boolean,
	open: Boolean,
	data: {
		type: Object as PropType<FeatureConfig>,
	},
});

const formState = ref<FeatureConfig>({
	...props.data,
});

const emit = defineEmits(['update:open', 'ok']);

const mOpen = ref(props.open);

watch(
	() => props.open,
	() => {
		mOpen.value = props.open;
	}
);

watch(
	() => mOpen.value,
	() => {
		emit('update:open', mOpen.value);
	}
);

watch(
	() => props.data,
	() => {
		formState.value = {
			...props.data,
		};
	},
	{ deep: true }
);

const rules = ref<Record<string, Rule[]>>({
	title: [{ required: true, message: '请填写展示名称' }],
	path: [
		{ required: true, message: '请填写路径' },
		{
			validator: validatorPath,
		},
		{
			validator: validatorSpecialChars,
		},
	],
	frameSrc: [
		{ required: true, message: '请填写http地址' },
		{
			validator: validatorURL,
		},
	],
});

const getDisable = computed(
	() =>
		!props.edit ||
		isUndefined(formState.value.path) ||
		formState.value.path === '' ||
		isUndefined(formState.value.title) ||
		formState.value.title === '' ||
		isUndefined(formState.value.frameSrc) ||
		formState.value.frameSrc === ''
);
function onOk() {
	emit('ok', {
		...formState.value,
		type: 'link',
		icon: 'svg-icon:lianjie',
	});
	mOpen.value = false;
}
</script>
