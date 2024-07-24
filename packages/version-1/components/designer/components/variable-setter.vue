<template>
	<div v-bind="$attrs">
		<Button :type="getStatue.type" @click="open = !open">{{
			getStatue.text
		}}</Button>
		<Modal
			centered
			:closable="false"
			width="30%"
			title="变量绑定"
			v-model:open="open"
			:z-index="2000"
		>
			<div class="vs-variable-selector-inner">
				<ul class="vs-variable-selector-category vs-variable-selector-ul">
					<li
						v-for="item in Object.keys(variableListMap)"
						:key="item"
						:class="{ active: selParentVariable === item }"
						@click="onVariableItemClick(item)"
					>
						{{ variableListMap[item].name }}
					</li>
				</ul>
				<div style="width: 100%; padding-left: 8px; padding-right: 8px">
					<LtTree
						search
						:height="340"
						v-model:selectedKeys="selectedKeys"
						:tree-data="treeData"
						:blockNode="false"
					>
					</LtTree>
				</div>
			</div>
			<template #footer>
				<Button danger @click="removeBind"> 移除绑定</Button>
				<Button
					@click="
						() => {
							open = false;
						}
					"
				>
					取消</Button
				>
				<Button type="primary" @click="onOk"> 确认</Button>
			</template>
		</Modal>
	</div>
</template>

<script lang="ts" setup>
import {
	LtDatasource,
	LtTree,
	SettingsPaneContext,
	settingsPaneContext,
} from '@lt-frame/components';
import { Recordable } from '@lt-frame/utils';
import { Modal, Button, TreeProps, notification } from 'ant-design-vue';
import { PropType, computed, inject, ref, watch } from 'vue';
import { DatasourceContrast } from '../config';

const props = defineProps({
	value: {
		type: Object as PropType<DatasourceContrast>,
	},
	datasource: {
		type: Array,
	},
});

const emit = defineEmits(['change']);

const { popoverLock } = inject(settingsPaneContext) as SettingsPaneContext;

const open = ref(false);

const treeData = ref<TreeProps['treeData']>([]);

const selParentVariable = ref('');

const selectedKeys = ref<string[]>([]);

const datasourceContrast = ref<DatasourceContrast>();

const getStatue = computed(() => {
	const { value } = props;
	if (value) {
		const { key } = value;
		if (key) {
			return {
				type: 'primary',
				text: '已绑定',
			} as any;
		}
	}

	return {
		type: 'default',
		text: '绑定数据源',
	} as any;
});

const variableListMap = ref<Recordable>({
	builtInDatasource: {
		name: '内置数据源',
		childrens: Object.keys(LtDatasource.getStore()).map((item) => ({
			title: item,
			key: item,
		})),
	},
	customDatasource: {
		name: '自定义数据源',
		childrens: props.datasource,
	},
});

function onVariableItemClick(key: string) {
	selParentVariable.value = key;
	treeData.value = variableListMap.value[key].childrens;
}

watch(
	() => selectedKeys.value,
	() => {
		datasourceContrast.value = {
			type: selParentVariable.value,
			key: selectedKeys.value.length > 0 ? selectedKeys.value[0] : undefined,
		};
	}
);

watch(
	open,
	() => {
		popoverLock.value = !open.value;
		popoverLock.value;
		if (open.value) {
			const { value } = props;
			if (value) {
				const { key, type } = value;
				if (type) {
					onVariableItemClick(type);
				}
				if (key) {
					selectedKeys.value = [key];
				}
			}
		}
	},
	{
		immediate: true,
	}
);

function onOk() {
	if (datasourceContrast.value?.key) {
		emit('change', datasourceContrast);
		open.value = false;
		return;
	}
	notification.warn({
		duration: 3,
		message: '请选择数据源',
		style: {
			zIndex: 3000,
		},
	});
}

function removeBind() {
	emit('change');
	open.value = false;
}
</script>
