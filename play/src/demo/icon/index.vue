<template>
	<LtPageLayout title="图标">
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
			<LtIcon icon="ion:layers-outline" :size="30" />
			<LtIcon icon="ion:bar-chart-outline" :size="30" />
			<LtIcon icon="ion:bar-chart-outline" :size="30" color="#e72727" />
			<LtIcon icon="ion:tv-outline" :size="30" />
			<LtIcon icon="ion:settings-outline" :size="30" spin />
			<LtIcon icon="ion:settings-outline" :size="30" spin />
			<LtIcon icon="svg-icon:file" :size="30" color="#e72727" />
		</div>
		<a-alert style="margin: 10px 0" message="SvgIcon组件" />
		<div style="display: flex; justify-content: space-around; margin: 12px">
			<LtSvgIcon name="file" color="#e72727" size="32" />
			<LtSvgIcon name="file" size="32" />
			<LtSvgIcon name="file" size="32" />
			<LtSvgIcon name="file" size="32" />
			<LtSvgIcon name="file" size="32" />
			<LtSvgIcon name="file" size="32" />
			<LtSvgIcon name="file" size="32" />
		</div>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { LtPageLayout, LtSvgIcon, LtIcon } from '@lt-frame/components';
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
