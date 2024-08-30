<template>
	<Popover
		:overlayInnerStyle="{
			padding: '3px',
		}"
		v-model:open="popoverOpen"
		trigger="click"
		placement="bottomLeft"
		:arrow="false"
	>
		<div ref="divRef">
			<Input v-model:value="inputValue">
				<template #prefix>
					<span class="fs-tag fs-tag-color" v-if="currentValue?.name"
						>{{ currentValue.name }}
						<span @click.stop="onClose" class="fs-close">
							<CloseOutlined />
						</span>
					</span>
				</template>
			</Input>
		</div>

		<template #content>
			<div :style="{ width: `${width}px` }">
				<vxe-grid
					ref="grid"
					v-on="gridEvents"
					v-bind="gridOptions"
				></vxe-grid></div
		></template>
	</Popover>
</template>

<script lang="ts" setup>
import { CloseOutlined } from '@ant-design/icons-vue';
import { useElementSize } from '@vueuse/core';
import { Popover, Input } from 'ant-design-vue';
import { PropType, reactive, ref, watch, computed } from 'vue';
import { VxeGridInstance, VxeGridListeners, VxeGridProps } from 'vxe-table';
import Fuse from 'Fuse.js';
import { FeatureRow } from '../../../types';

defineOptions({
	inheritAttrs: false,
});

const emit = defineEmits(['update:value', 'currentChange']);

const props = defineProps({
	value: String,
	list: {
		type: Array as PropType<FeatureRow[]>,
		default: () => [],
	},
});

const popoverOpen = ref(false);
const grid = ref<VxeGridInstance>();
const divRef = ref(null);
const inputValue = ref();

const currentValue = ref<FeatureRow>({
	name: props.value ? props.value : '',
});

const { width } = useElementSize(divRef);

const gridOptions = reactive<VxeGridProps>({
	height: 300,
	scrollY: { enabled: true },
	size: 'medium',
	columns: [
		{ field: 'title', title: '应用名称' },
		{ field: 'name', title: 'name' },
	],
	rowConfig: {
		height: 50,
	},
	border: 'inner',
	data: [...props.list],
});

const gridEvents = reactive<VxeGridListeners>({
	currentChange: (params: any) => {
		const { row } = params;
		if (row) {
			currentValue.value = { ...row };
			emit('currentChange', currentValue.value);
		}
	},
});

function onClose() {
	currentValue.value = undefined as any;
	grid.value?.clearCurrentRow();
	emit('currentChange', currentValue.value);
}

watch(
	() => currentValue.value,
	() => {
		emit('update:value', currentValue.value?.component);
		popoverOpen.value = false;
	}
);

watch(
	() => inputValue.value,
	() => {
		searchEvent();
	}
);

const fuse = computed(
	() =>
		// 模糊查询的查找字段
		new Fuse(gridOptions.data ? gridOptions.data : [], {
			keys: ['name', 'title'],
			threshold: 0.3,
		})
);

const searchEvent = () => {
	const filterVal = String(inputValue.value).trim().toLowerCase();
	if (filterVal) {
		gridOptions.data = fuse.value
			.search(inputValue.value)
			.map((params) => params.item);
	} else {
		gridOptions.data = [...props.list];
	}
};
</script>
