<template>
	<LTPageLayout title="图标">
		<a-alert style="margin: 10px 0" message="ant-design图标" />
		<div style="display: flex; justify-content: space-around; margin: 12px">
			<GithubFilled :style="{ fontSize: '30px' }" />
			<QqCircleFilled :style="{ fontSize: '30px' }" />
			<WechatFilled :style="{ fontSize: '30px' }" />
			<AlipayCircleFilled :style="{ fontSize: '30px' }" />
			<IeCircleFilled :style="{ fontSize: '30px' }" />
			<TaobaoCircleFilled :style="{ fontSize: '30px' }" />
			<CodepenCircleFilled :style="{ fontSize: '30px' }" />
		</div>
		<a-alert style="margin: 10px 0" message="Icon组件" />
		<div style="display: flex; justify-content: space-around; margin: 12px">
			<LTIcon icon="ion:layers-outline" :size="30" />
			<LTIcon icon="ion:bar-chart-outline" :size="30" />
			<LTIcon icon="ion:bar-chart-outline" :size="30" color="#e72727" />
			<LTIcon icon="ion:tv-outline" :size="30" />
			<LTIcon icon="ion:settings-outline" :size="30" spin />
			<LTIcon icon="ion:settings-outline" :size="30" spin />
			<LTIcon icon="svg-icon:file" :size="30" color="#e72727" />
		</div>
		<a-alert style="margin: 10px 0" message="SvgIcon组件" />
		<div style="display: flex; justify-content: space-around; margin: 12px">
			<LTSvgIcon name="file" color="#e72727" size="32" />
			<LTSvgIcon name="file" size="32" />
			<LTSvgIcon name="file" size="32" />
			<LTSvgIcon name="file" size="32" />
			<LTSvgIcon name="file" size="32" />
			<LTSvgIcon name="file" size="32" />
			<LTSvgIcon name="file" size="32" />
		</div>
	</LTPageLayout>
</template>

<script setup lang="ts">
import { LTPageLayout, LTSvgIcon, LTIcon } from 'lt-frame';
import { Alert as AAlert } from 'ant-design-vue';

import {
	QqCircleFilled,
	GithubFilled,
	WechatFilled,
	AlipayCircleFilled,
	IeCircleFilled,
	TaobaoCircleFilled,
	CodepenCircleFilled,
} from '@ant-design/icons-vue';
</script>
