<template>
	<div ref="wrapEl"></div>
	<a-alert style="margin-bottom: 10px" message="组件方式" />
	<a-button type="primary" @click="openCompFullLoading"> 全屏 Loading</a-button>
	<a-button type="primary" @click="openCompAbsolute"> 容器内 Loading</a-button>
	<LTLoading
		:theme="'dark'"
		:loading="loading"
		:absolute="absolute"
		:tip="'加载中'"
	></LTLoading>

	<a-alert style="margin: 10px 0" message="函数方式" />

	<a-button type="primary" @click="openFnFullLoading"> 全屏 Loading </a-button>
	<a-button type="primary" @click="openFnWrapLoading">
		容器内 Loading
	</a-button>
	<a-alert style="margin: 10px 0" message="v-loading指令方式" />
	<a-button type="primary" @click="openDirectiveLoading">
		打开指令Loading
	</a-button>
</template>

<script lang="ts" setup>
import { Alert as AAlert, Button as AButton } from 'ant-design-vue';
import { ref } from 'vue';
import { LTLoading } from '@lt-frame/components';
import { useLoading } from '@lt-frame/hooks';

const loading = ref(false);
const absolute = ref(false);
const wrapEl = ref(null);
const loadingRef = ref(false);

const [openFullLoading, closeFullLoading] = useLoading({
	tip: '加载中...',
});

const [openWrapLoading, closeWrapLoading] = useLoading({
	target: wrapEl,
	props: {
		tip: '加载中...',
		absolute: true,
		theme: 'dark',
	},
});

function openFnFullLoading() {
	openFullLoading();
	setTimeout(() => {
		closeFullLoading();
	}, 2000);
}

function openFnWrapLoading() {
	openWrapLoading();

	setTimeout(() => {
		closeWrapLoading();
	}, 2000);
}
function openDirectiveLoading() {
	loadingRef.value = true;
	setTimeout(() => {
		loadingRef.value = false;
	}, 2000);
}

function openCompFullLoading() {
	loading.value = true;
	absolute.value = false;
	setTimeout(() => {
		loading.value = false;
	}, 12000);
}

function openCompAbsolute() {
	loading.value = true;
	absolute.value = true;
	setTimeout(() => {
		loading.value = false;
	}, 2000);
}
</script>
