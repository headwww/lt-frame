<template>
	<div :class="ns.b()">
		<div :style="getWidth" :class="ns.e('svg')">
			<div style="width: 132px; height: 40px">
				<LtSvgIcon
					@click="go()"
					style="cursor: pointer; height: 40px"
					name="logo-with-text"
					size="132"
				></LtSvgIcon>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { LtSvgIcon } from '@lt-frame/components';
import { useNamespace } from '@lt-frame/hooks';
import { CSSProperties, computed } from 'vue';
import { useGo, useMenuSetting } from '../../../../hooks';

const ns = useNamespace('header-logo');

const go = useGo();

const { getCollapsed } = useMenuSetting();

const getWidth = computed((): CSSProperties => {
	if (!getCollapsed.value) {
		return { width: '240px' };
	}
	return { width: '36px' };
});
</script>
