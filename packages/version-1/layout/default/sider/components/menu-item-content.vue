<template>
	<span>
		<LTIcon v-if="getIcon" :icon="getIcon" :size="18"></LTIcon>
		<span>{{ item.name }}</span>
	</span>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { LTIcon } from '@lt-frame/components';
import { Menu } from '../../../../types';

const props = defineProps({
	item: {
		type: Object as PropType<Menu>,
		default: () => ({}),
	},
});

const getIcon = computed(() => props.item?.icon);
</script>
