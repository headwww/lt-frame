<template>
	<Popover
		v-model:open="popoverOpen"
		:overlayInnerStyle="{
			padding: '8px',
		}"
		trigger="click"
		placement="right"
		:arrow="false"
	>
		<div class="ic-selector-box">
			<PlusOutlined v-if="!mValue" class="ic-plusout" />
			<LtIcon v-else size="50" :icon="mValue" />
			<CloseCircleFilled
				v-if="mValue"
				@click.stop="onClose"
				class="item-icon-close"
			/>
		</div>
		<template #content>
			<div class="ic-icons">
				<Flex wrap="wrap" gap="middle">
					<div
						@click="onItemIcon(item)"
						class="ic-icons-item"
						v-for="item in list"
						:key="item"
					>
						<LtIcon size="30" :icon="item" />
					</div>
				</Flex>
			</div>
		</template>
	</Popover>
</template>

<script lang="ts" setup>
import { PlusOutlined, CloseCircleFilled } from '@ant-design/icons-vue';
import { Popover, Flex } from 'ant-design-vue';
import { LtIcon } from '@lt-frame/components';
import { PropType, ref, watch } from 'vue';

const popoverOpen = ref(false);

function onItemIcon(name: string) {
	mValue.value = name;
	popoverOpen.value = false;
}

const props = defineProps({
	list: Array as PropType<string[]>,
	value: String,
});

const emit = defineEmits(['update:value']);

const mValue = ref(props.value);

watch(
	() => props.value,
	() => {
		mValue.value = props.value;
	}
);

watch(
	() => mValue.value,
	() => {
		emit('update:value', mValue.value);
	}
);

function onClose() {
	mValue.value = undefined;
}
</script>
