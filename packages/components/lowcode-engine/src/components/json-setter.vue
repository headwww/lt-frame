<template>
	<div v-bind="$attrs">
		<div>
			<Button @click="open = !open">设置</Button>
		</div>
		<Modal
			centered
			:closable="false"
			width="50%"
			title="JSON编辑器"
			v-model:open="open"
			:z-index="2000"
			@ok="onOk"
		>
			<div class="flex">
				<LtJsonEditor
					ref="jsonEditor"
					:options="{
						mode: 'code',
						mainMenuBar: false,
						statusBar: false,
						onError,
					}"
					v-model="json"
					class="h-400px flex-1"
				>
				</LtJsonEditor>
				<div class="ml12px w380px h-400px overflow-auto">
					<template v-for="(item, index) in document" :key="index">
						<TypographyTitle v-if="item.type === 'title'" :level="5">{{
							item.content
						}}</TypographyTitle>
						<TypographyParagraph
							:copyable="item.copyable"
							v-if="item.type === 'paragraph'"
							:level="5"
							>{{ item.content }}</TypographyParagraph
						>
					</template>
				</div>
			</div>
		</Modal>
	</div>
</template>

<script lang="ts" setup>
import { PropType, inject, ref, watch } from 'vue';
import {
	Modal,
	Button,
	TypographyParagraph,
	TypographyTitle,
	notification,
} from 'ant-design-vue';
import { Fn } from '@lt-frame/utils';
import { isArray, isFunction } from 'lodash-es';
import { LtJsonEditor } from '../../../json-editor';
import { SettingsPaneContext, settingsPaneContext } from '../context-key';

const { popoverLock } = inject(settingsPaneContext) as SettingsPaneContext;

const props = defineProps({
	value: Object as PropType<object>,
	document: Array as PropType<
		Array<{
			type?: 'title' | 'paragraph';
			content?: string | number;
			copyable?: boolean;
		}>
	>,
	validate: Function as PropType<Fn<any, Boolean>>,
});

const emit = defineEmits(['change']);

const json = ref(props.value || [{}]);

const open = ref(false);

const jsonEditor = ref();

watch(
	open,
	() => {
		// 加锁，防止Popover关闭
		popoverLock.value = !open.value;
		if (open.value) {
			json.value = props.value || [{}];
		}
	},
	{
		immediate: true,
	}
);

const onError = () => {};

async function onOk() {
	const error = await jsonEditor.value.getJsonEditor().validate();
	if (isArray(error) && error.length === 0) {
		const { validate } = props;
		if (isFunction(validate)) {
			if (validate(json.value)) {
				open.value = false;
				return emit('change', json.value);
			}
			return;
		}
		open.value = false;
		return emit('change', json.value);
	}
	notification.error({
		duration: 3,
		message: '格式有误',
		style: {
			zIndex: 3000,
		},
	});
}
</script>
