<template>
	<section
		:class="{ [`${ns.b()}`]: true, absolute, [`${theme}`]: !!theme }"
		:style="[background ? `background-color: ${background}` : '']"
		v-show="loading"
	>
		<Spin
			:indicator="indicator"
			v-bind="$attrs"
			:tip="tip"
			:size="size"
			:spinning="loading"
		/>
	</section>
</template>
<script lang="ts" setup>
import { h } from 'vue';
import { Spin } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { useNamespace } from '@lt-frame/hooks';
import { loadingProps } from './loading';

const ns = useNamespace('loading');
defineOptions({
	name: 'LTLoading',
});
defineProps(loadingProps);
const indicator = h(LoadingOutlined, {
	style: {
		fontSize: '24px',
	},
	spin: true,
});
</script>
