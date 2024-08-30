<!--
 * @Description: 新增一个vue功能
 * @Author: sw
-->
<template>
	<LtModal
		v-model:open="mOpen"
		title="应用设置"
		width="600px"
		@ok="onOk"
		destroy-on-close
		:ok-button-props="{
			disabled: getDisable,
		}"
	>
		<div style="height: 320px">
			<Form layout="vertical" :model="formState" :rules="rules">
				<FormItem label="选择应用" name="component">
					<FeatureSelector
						:list="getFeatures"
						v-model:value="formState.component"
						@current-change="onCurrentChange"
					/>
				</FormItem>
				<FormItem label="应用名称" name="title">
					<Input v-model:value="formState.title" />
				</FormItem>
				<FormItem label="路径" name="path">
					<Input
						:placeholder="
							convertToKebabCase(formState.name ? formState.name : '')
						"
						v-model:value="formState.path"
					/>
				</FormItem>
			</Form>
		</div>
	</LtModal>
</template>

<script setup lang="ts">
import { Form, FormItem, Input } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { LtModal } from '@lt-frame/components';
import { computed, PropType, ref, watch } from 'vue';
import { isUndefined } from 'lodash-es';
import { FeatureConfig, FeatureRow } from '../../../types';
import FeatureSelector from './feature-selector.vue';
import { convertToKebabCase, validatorPath } from './utils';
import { componentInfoMap } from '../../../configs';

defineOptions({
	name: 'ModalAddFeature',
	inheritAttrs: false,
});

const props = defineProps({
	edit: Boolean,
	open: Boolean,
	data: {
		type: Object as PropType<FeatureConfig>,
	},
});

const emit = defineEmits(['update:open', 'ok']);

const getFeatures = computed(() =>
	Object.keys(componentInfoMap).map(
		(item) =>
			({
				component: item,
				name: componentInfoMap[item].name,
				title: componentInfoMap[item].title,
				introduce: componentInfoMap[item].introduce,
				version: componentInfoMap[item].version,
			}) as FeatureRow
	)
);

const formState = ref<FeatureConfig>({
	...props.data,
});

const rules = ref<Record<string, Rule[]>>({
	title: [{ required: true, message: '请填写应用名称' }],
	component: [{ required: true, message: '请选择应用' }],
	path: [
		{ required: true, message: '请填写路径' },
		{
			validator: validatorPath,
		},
	],
});

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

const getDisable = computed(
	() =>
		!props.edit ||
		isUndefined(formState.value.component) ||
		formState.value.component === '' ||
		isUndefined(formState.value.title) ||
		formState.value.title === ''
);

function onOk() {
	emit('ok', {
		...formState.value,
		type: 'feature',
		icon: 'svg-icon:wangye',
		path: formState.value.path
			? formState.value.path
			: convertToKebabCase(formState.value.name ? formState.value.name : ''),
	});
	mOpen.value = false;
}

function onCurrentChange(params: FeatureRow) {
	if (params) {
		formState.value.title = params.title ? params.title : '';
		formState.value.name = params.name ? params.name : '';
	} else {
		formState.value.title = undefined;
		formState.value.name = undefined;
		formState.value.path = undefined;
	}
}
</script>
