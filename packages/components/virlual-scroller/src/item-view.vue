<template>
	<component :is="itemTag" :class="ns.e('item-view')">
		<slot :item="view?.item" :index="view?.nr.index" :active="view?.nr.used" />
	</component>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { itemViewProps } from './item-view';

defineOptions({ name: 'LtItemView' });

defineProps(itemViewProps);
const ns = useNamespace('recycle-scroller');
</script>
