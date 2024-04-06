<template>
	<LtPageLayout
		title="Page组件"
		content="content属性"
		subTitle="二级标题"
		:tags="['tag1', 'tag1', 'tag1']"
		contentFullHeight
		fixedHeight
		dense
	>
		<div
			style="
				background-color: #fff;
				padding: 20px;
				font-size: 18px;
				height: 100%;
			"
		>
			具体使用参考antv的pageHeader组件，该组件文档中的slot都可以使用
		</div>
	</LtPageLayout>
</template>

<script lang="ts" setup>
import { LtPageLayout } from '@lt-frame/components';
</script>
