<template>
	<LTApplication>
		<LTSvgIcon name="file" color="#DEDEDE" size="32" />
		<LTIcon icon="ion:layers-outline" :size="30" />
		<div>
			<a-button color="success"> 成功 </a-button>
			<a-button color="success" disabled> 禁用 </a-button>
			<a-button color="success" loading> loading </a-button>
			<a-button color="success" type="link"> link </a-button>
			<a-button color="success" type="link" loading> loading link </a-button>
			<a-button color="success" type="link" disabled> disabled link </a-button>
		</div>
		<div>
			<a-button color="warning"> 警告 </a-button>
			<a-button color="warning" disabled> 禁用 </a-button>
			<a-button color="warning" loading> loading </a-button>
			<a-button color="warning" type="link"> link </a-button>
			<a-button color="warning" type="link" loading> loading link </a-button>
			<a-button color="warning" type="link" disabled> disabled link </a-button>
		</div>
		<div>
			<a-button color="error"> 错误 </a-button>
			<a-button color="error" disabled> 禁用 </a-button>
			<a-button color="error" loading> loading </a-button>
			<a-button color="error" type="link"> link </a-button>
			<a-button color="error" type="link" loading> loading link </a-button>
			<a-button color="error" type="link" disabled> disabled link </a-button>
		</div>
		<div>
			<a-button ghost color="success"> 幽灵成功 </a-button>
			<a-button ghost color="warning"> 幽灵警告 </a-button>
			<a-button ghost color="error"> 幽灵错误 </a-button>
			<a-button ghost type="dashed" color="warning"> 幽灵警告dashed </a-button>
			<a-button ghost danger> 幽灵危险 </a-button>
		</div>
		<div>
			<a-button type="primary" preIcon="mdi:page-next-outline">
				主按钮
			</a-button>
			<a-button type="primary" disabled> 禁用 </a-button>
			<a-button type="primary" danger preIcon="mdi:page-next-outline">
				危险
			</a-button>
			<a-button type="primary" loading> loading </a-button>
			<a-button type="link"> link </a-button>
			<a-button type="link" loading> loading link </a-button>
			<a-button type="link" disabled> disabled link </a-button>
		</div>
		<div>
			<a-button type="default"> 默认 </a-button>
			<a-button type="default" disabled> 禁用 </a-button>
			<a-button type="default" danger> 危险 </a-button>
			<a-button type="default" loading> loading </a-button>
			<a-button type="link"> link </a-button>
			<a-button type="link" loading> loading link </a-button>
			<a-button type="link" disabled> disabled link </a-button>
		</div>
		<div>
			<a-button type="dashed"> dashed </a-button>
			<a-button type="dashed" disabled> 禁用 </a-button>
			<a-button type="dashed" danger> 危险 </a-button>
			<a-button type="dashed" loading> loading </a-button>
		</div>

		<div>
			<div style="background-color: #8b8b8be6; padding: 10px">
				<a-button ghost type="primary"> 幽灵主要 </a-button>
				<a-button ghost type="default"> 幽灵默认 </a-button>
				<a-button ghost type="dashed"> 幽灵dashed </a-button>
				<a-button ghost type="primary" disabled> 禁用 </a-button>
				<a-button ghost type="primary" loading> loading </a-button>
			</div>
		</div>
		<Hook style="left: auto" @click="() => {}"></Hook>
		<LTArrow @click="handleArrow" :expand="!isAdvanced" up></LTArrow>
	</LTApplication>
</template>
<script setup lang="ts">
import {
	LTSvgIcon,
	LTIcon,
	LTButton as AButton,
	LTApplication,
	LTArrow,
} from '@lt-frame/components';
import { ref } from 'vue';
import Hook from './Hook.vue';

const isAdvanced = ref(false);

function handleArrow() {
	isAdvanced.value = !isAdvanced.value;
}
</script>
