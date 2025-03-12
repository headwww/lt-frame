<template>
	<div v-bind="$attrs" style="width: 100%">
		<Popover :arrow="false" trigger="click">
			<template #content>
				<div class="function-editor">
					<Codemirror
						v-model="code"
						:style="{ height: '300px', width: '400px' }"
						:autofocus="true"
						:indent-with-tab="true"
						:tabSize="2"
						:extensions="extensions"
					/>
					<div class="template-section" style="width: 400px">
						<div class="template-title">常用函数模板</div>
						<div class="template-list">
							<Tag
								v-for="temp in templates"
								:key="temp.name"
								class="template-item"
								@click="insertTemplate(temp.code)"
							>
								{{ temp.name }}
							</Tag>
						</div>
					</div>
				</div>
			</template>
			<Button style="width: 100%">{{ text }}</Button>
		</Popover>
	</div>
</template>

<script lang="ts" setup>
import { Codemirror } from 'vue-codemirror';
import { Button, Popover, Tag } from 'ant-design-vue';
import { ref, watchEffect } from 'vue';
import { javascript } from '@codemirror/lang-javascript';

const text = ref('编辑函数');

const emit = defineEmits(['update:value', 'change']);

const props = defineProps({
	value: {
		type: String,
		default: '',
	},
});

const code = ref(props.value);

watchEffect(() => {
	const functionName = code.value.trim().match(/function\s+(\w+)/)?.[1];
	text.value = functionName || '新建函数';
	emit('update:value', code.value);
	emit('change', code.value);
});

// 配置 Codemirror 扩展
const extensions = [
	javascript(), // JavaScript 语言支持
];
const templates = [
	{
		name: '合计',
		code: `/**
 * 计算数组中指定字段的总和
 * @param {Array} list - 要计算的数组，包含多个对象
 * @param {string} field - 需要计算的字段路径，支持嵌套属性（如 'user.age'）
 * @param {Object} lodash - lodash工具库，用于安全地获取对象属性值
 * @returns {string} 返回保留一位小数的合计值
 */
function sum(list, field, lodash) {
  let count = 0;
  list.forEach((item) => {
    count += Number(lodash.get(item, field));
  });
  return count.toFixed(1);
}`,
	},
	{
		name: '平均值',
		code: `/**
 * 计算数组中指定字段的平均值
 * @param {Array} list - 要计算的数组，包含多个对象
 * @param {string} field - 需要计算的字段路径，支持嵌套属性（如 'user.age'）
 * @param {Object} lodash - lodash工具库，用于安全地获取对象属性值
 * @returns {string} 返回保留一位小数的平均值
 */
function mean(list, field, lodash) {
  let count = 0;
  list.forEach((item) => {
    count += Number(lodash.get(item, field));
  });
  return (count / list.length).toFixed(1);
}`,
	},
];

const insertTemplate = (templateCode: string) => {
	code.value = templateCode;
};
</script>

<style scoped>
.function-editor {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.template-section {
	padding: 8px;
	background: #f5f5f5;
	border-radius: 4px;
	box-sizing: border-box;
}

.template-title {
	font-size: 14px;
	color: #666;
	margin-bottom: 8px;
}

.template-list {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	gap: 8px;
}

.template-item {
	cursor: pointer;
	text-align: center;
	width: 100%;
	margin: 0;
}

.template-item:hover {
	color: #1890ff;
	border-color: #1890ff;
}
</style>
