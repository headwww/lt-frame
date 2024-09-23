<template>
	<LtDraggable class="drag-area" tag="ul" v-model="list" group="g1">
		<li v-for="el in modelValue" :key="el.name" style="display: inline">
			<p>{{ el.name }}</p>
			<nested-component v-model="el.children" />
		</li>
	</LtDraggable>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { LtDraggable } from '@lt-frame/components';
import NestedComponent from './NestedComponent.vue';

interface IList {
	name: string;
	children: IList[];
}

interface Props {
	modelValue: IList[];
}

const props = defineProps<Props>();

interface Emits {
	(e: 'update:modelValue', value: IList[]): void;
}

const emits = defineEmits<Emits>();
const list = computed({
	get: () => props.modelValue,
	set: (value) => emits('update:modelValue', value),
});
</script>
<style lang="scss" scoped>
.drag-area {
	min-height: 100px;
	outline: 1px dashed;
}

ul {
	padding-left: 1.25rem;
	margin: 16px 0;
}
</style>
