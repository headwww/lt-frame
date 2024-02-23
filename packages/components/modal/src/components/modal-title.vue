<template>
	<div ref="modalTitle" :class="ns.b()">
		<div :class="ns.b('main')">
			{{ title }}
			<Tooltip placement="right">
				<QuestionCircleOutlined
					v-if="tip"
					style="color: #8b8b8b; font-size: 14px"
				>
				</QuestionCircleOutlined>
				<template #title>
					<span>{{ tip }}</span>
				</template>
			</Tooltip>
		</div>
		<div :class="ns.b('sub')">{{ subTitle }}</div>
	</div>
</template>

<script lang="ts" setup>
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { Tooltip } from 'ant-design-vue';
import { ref } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import { modalTitleProps } from './modal-title';

defineProps(modalTitleProps);

defineOptions({
	name: 'ModalTitle',
});

const ns = useNamespace('modal-title');

const modalTitle = ref<HTMLDivElement>();
</script>
