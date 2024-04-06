<template>
	<Button v-bind="getBindValue" :class="getButtonClass" @click="onClick">
		<template #default="data">
			<Icon :icon="preIcon" v-if="preIcon" :size="iconSize" />
			<slot v-bind="data || {}"></slot>
			<Icon :icon="postIcon" v-if="postIcon" :size="iconSize" />
		</template>
	</Button>
</template>

<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { ComponentOptionsMixin, computed, unref } from 'vue';
import { useAttrs } from '@lt-frame/hooks';
import Icon from '../../icon';
import { buttonProps } from './button';

defineOptions({
	name: 'LtButton',
	extends: Button as ComponentOptionsMixin,
	inheritAttrs: false,
});

const props = defineProps(buttonProps);
const attrs = useAttrs({ excludeDefaultKeys: false });
const getButtonClass = computed(() => {
	const { color, disabled } = props;
	return [
		{
			[`ant-btn-${color}`]: !!color,
			[`is-disabled`]: disabled,
		},
	];
});

const getBindValue = computed(() => ({ ...unref(attrs), ...props }));
</script>
