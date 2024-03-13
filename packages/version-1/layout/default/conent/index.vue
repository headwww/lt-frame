<template>
	<LayoutContent :class="ns.b()">
		<div v-loading="getPageLoading">
			<PageLayout />
		</div>
	</LayoutContent>
</template>

<script lang="ts" setup>
import { LayoutContent } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import { Loading as vLoading } from '@lt-frame/directives';
import PageLayout from '../../page/index.vue';
import { useAppSetting } from '../../../hooks';

const ns = useNamespace('layout-content');

const { getPageLoading } = useAppSetting();
</script>
