<template>
	<div :class="ns.b()">
		<LtFadeTransition>
			<div :class="ns.e('main')" v-show="mode === 'main'">
				<slot name="main"> </slot>
			</div>
		</LtFadeTransition>
		<LtFadeTransition>
			<div ref="elSlave" :class="ns.e('slave')" v-show="mode === 'slave'">
				<div ref="elForm">
					<slot name="form"> </slot>
				</div>
				<div :style="getSlaveStyle">
					<slot name="slave"> </slot>
				</div>
			</div>
		</LtFadeTransition>
	</div>
</template>

<script lang="ts" setup>
import { CSSProperties, PropType, computed, ref } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import { useElementSize } from '@vueuse/core';
import { LtFadeTransition } from '../../transition';

defineOptions({
	name: 'LtMainSlaveLayout',
});
const elSlave = ref();
const elForm = ref();

const { height: height1 } = useElementSize(elSlave);
const { height: height2 } = useElementSize(elForm);

const getSlaveStyle = computed((): CSSProperties => {
	const h = height1.value - height2.value;
	return {
		height: `${h}px`,
	};
});

defineProps({
	mode: {
		type: String as PropType<'main' | 'slave'>,
		default: () => 'main',
	},
});

const ns = useNamespace('main-slave');
</script>
