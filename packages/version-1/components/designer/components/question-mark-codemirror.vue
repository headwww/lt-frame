<template>
	<Codemirror
		v-model="editorContent"
		:extensions="extensions"
		:style="{ height: '100%' }"
	/>
</template>
<script setup lang="ts">
// 导入所需组件和工具函数
import { Codemirror } from 'vue-codemirror';
import { ref, h, createApp, watch, onMounted, nextTick, PropType } from 'vue';
import { EditorView } from 'codemirror';
import { highlightSpecialChars } from '@codemirror/view';
import { sql as SQL } from '@codemirror/lang-sql';
import QuestionMarkSetter from './question-mark-setter.vue';

const props = defineProps({
	content: String,
	extraParams: Array as PropType<Array<number | undefined>>,
});

// 编辑器内容,初始值为两个问号
const editorContent = ref(props.content);

// 存储问号id和对应的时间戳映射关系
const questionMarkTimeMap = ref<Record<string, number | undefined>>({});

// 存储所有问号对应的时间戳数组,按顺序排列
const timeStampArray = ref<Array<number | undefined>>(props.extraParams || []);

// 定义emit
const emit = defineEmits(['update:value']);

// 监听编辑器内容和时间戳数组变化
watch(
	[editorContent, timeStampArray],
	([content, timeArray]) => {
		// 组合成对象传递给父组件
		emit('update:value', {
			script: content,
			extraParams: timeArray,
		});
	},
	{ deep: true }
);

// 监听问号时间映射变化,同步更新时间戳数组
watch(
	questionMarkTimeMap,
	(newMap) => {
		// 获取所有问号容器元素
		const questionMarkElements = document.querySelectorAll(
			'span[data-lt-question-id]'
		);
		// 根据问号容器的顺序重建时间戳数组
		timeStampArray.value = Array.from(questionMarkElements).map((container) => {
			const id = (container as HTMLElement).dataset.ltQuestionId;
			return id ? newMap[id] : undefined;
		});
	},
	{ deep: true }
);

// 定义问号按钮组件
const QuestionMarkButton = {
	props: {
		id: {
			type: String,
			required: true,
		},
	},
	setup(props: any) {
		const selectedDate = ref();
		onMounted(() => {
			nextTick(() => {
				// 根据问号ID获取对应位置的时间戳
				questionMarkTimeMap.value[props.id] =
					timeStampArray.value[
						Array.from(
							document.querySelectorAll('span[data-lt-question-id]')
						).findIndex(
							(el) => (el as HTMLElement).dataset.ltQuestionId === props.id
						)
					];
				selectedDate.value = questionMarkTimeMap.value[props.id];
			});
		});

		// 渲染日期选择器组件
		return () =>
			h(QuestionMarkSetter, {
				value: selectedDate.value,
				'onUpdate:value': (val: number) => {
					selectedDate.value = val;
					questionMarkTimeMap.value[props.id] = val;
				},
			});
	},
};

// CodeMirror编辑器扩展配置
const extensions = [
	// 配置问号字符的特殊渲染
	highlightSpecialChars({
		specialChars: /\?/g,
		render: () => {
			// 创建问号容器
			const container = document.createElement('span');
			// 生成唯一ID
			const id = Math.random().toString(36).substring(2, 8);
			// 创建问号按钮组件实例
			const app = createApp(QuestionMarkButton, {
				id,
			});

			// 挂载组件并设置问号ID
			app.mount(container);
			container.dataset.ltQuestionId = id;

			// 监听容器销毁事件
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.removedNodes.forEach((node) => {
						if (node === container) {
							// 清理相关数据并销毁组件
							container.dataset.ltQuestionId &&
								delete questionMarkTimeMap.value[
									container.dataset.ltQuestionId
								];
							app.unmount();
							observer.disconnect();
						}
					});
				});
			});

			// 开始观察DOM变化
			observer.observe(container.parentElement || document.body, {
				childList: true,
				subtree: true,
			});

			return container;
		},
	}),
	// 启用编辑器自动换行
	EditorView.lineWrapping,
	SQL(),
];
</script>
