<template>
	<div class="lt-material-table">
		<Spin wrapperClassName="h-full" :spinning="spinning2" tip="加载配置...">
			<div ref="container" class="flex flex-col h-full">
				<div ref="toolBar" class="w-full flex p-10px">
					<div class="flex-1">
						<Button
							v-for="(button, index) in toolButtons"
							class="mr-6px"
							:key="index"
							:type="button.type"
							@click="onButtonsClick(button)"
							:disabled="handleDisabled(button.bindDisabled)"
							>{{ button.title }}
						</Button>
					</div>
					<div>
						<Button
							shape="circle"
							:icon="h(SettingOutlined)"
							@click="onConfig"
						></Button>
					</div>
				</div>
				<div :style="tableStyle">
					<slot name="table"> </slot>
				</div>
				<div ref="pagerBar" :class="isPage ? 'h-70px' : 'h-6px'">
					<vxe-pager
						v-if="isPage"
						v-bind="page"
						v-model:current-page="page.currentPage"
						v-model:page-size="page.pageSize"
						@page-change="handlePageChange"
					/>
				</div>
			</div>
		</Spin>

		<Modal
			:open="open"
			width="100%"
			:closable="false"
			:footer="null"
			destroy-on-close
			wrap-class-name="lt-table-designer"
		>
			<Spin :spinning="spinning" size="large" tip="加载编辑器">
				<Designer @cancel="onCancel" @save="onSave">
					<template #designer-pane>
						<div class="flex m-12px">
							<div class="flex-1">
								<Button
									class="ml-6px"
									v-for="(button, index) in toolButtons"
									:key="index"
									:type="button.type"
									>{{ button.title }}
								</Button>
							</div>
							<div tools></div>
						</div>
						<vxe-grid
							v-if="!spinning"
							ref="xGrid"
							class="p-5px"
							v-bind="options"
						></vxe-grid>
					</template>
					<template #setting-pane>
						<SettingsPane
							v-if="!spinning"
							v-model:value="tempSettingValue"
							:items="schemas"
						></SettingsPane>
					</template>
				</Designer>
			</Spin>
		</Modal>
	</div>
</template>

<script lang="ts" setup>
import { Button, Modal, Spin } from 'ant-design-vue';
import { computed, h, onMounted, ref, watch } from 'vue';
import { Designer, SettingsPane } from '@lt-frame/components';
import { cloneDeep, isFunction, isUndefined, omit } from 'lodash-es';
import { SettingOutlined } from '@ant-design/icons-vue';
import { VxePagerDefines, VxePagerProps } from 'vxe-table';
import { useResizeObserver } from '@vueuse/core';
import { tableProps } from './table';
import { DatasourceContrast, TableFields, ToolButtons } from '../config';
import { useSetterAdapter } from '../use-setter-adapter';
import { useMock } from './usemock';
import { useSchemas } from '../use-schemas';

const props = defineProps(tableProps);

const emit = defineEmits([
	'update:config',
	'update:pager',
	'setup',
	'pageChange',
]);

const open = ref(false);

const spinning = ref(false);
const spinning2 = ref(false);

const container = ref<HTMLDivElement>();
const toolBar = ref<HTMLDivElement>();
const pagerBar = ref<HTMLDivElement>();
const tableStyle = ref();

useResizeObserver(container, (entries: any) => {
	const entry = entries[0];
	const { height } = entry.contentRect;
	if (isPage.value) {
		tableStyle.value = {
			height: `${height - 120}px`,
		};
	} else {
		tableStyle.value = {
			height: `${height - 56}px`,
		};
	}
});

// 临时的配置数据
const tempSettingValue = ref<TableFields>({});

const rawToolButtons = ref();

const { options, toolButtons, buildTableOption } = useSetterAdapter(props);

const { schemas, buildSchemas } = useSchemas();

// 处理pager
const page = ref<VxePagerProps>(props.pager || {});

const isPage = computed(() => !isUndefined(props.pager));

watch(
	() => page.value,
	() => {
		emit('update:pager', page.value);
	}
);

watch(
	() => props.pager,
	() => {
		page.value = { ...props.pager };
	}
);

const eventBusKey = computed(() => {
	const keys = Object.keys(props.eventBus);
	return keys;
});

const datasourceKey = computed(() => {
	const keys = Object.keys(props.datasource);
	return keys;
});

function onButtonsClick(button: ToolButtons) {
	const fn = props.eventBus[button.bindClick];
	if (isFunction(fn)) {
		fn();
	}
}

buildSchemas(
	props.entity,
	eventBusKey.value.map((item) => ({
		label: item,
		value: item,
	})),
	datasourceKey.value.map((item) => ({
		title: item,
		key: item,
	}))
);

const { getData, setDate } = useMock();

watch(
	() => open.value,
	() => {
		if (open.value) {
			getSettingValue();
		}
	}
);

onMounted(() => {
	spinning2.value = true;
	getData().then((data) => {
		spinning2.value = false;
		tempSettingValue.value = data as any;
		options.value.autoResize = true;
		options.value.height = 'auto';
		emit('update:config', cloneDeep(omit(options.value, 'data')));
		emit('setup');
	});
});

// 模拟请求
const getSettingValue = () => {
	spinning.value = true;
	getData().then((data) => {
		spinning.value = false;
		tempSettingValue.value = data as any;
		rawToolButtons.value = toolButtons.value;
	});
};

watch(
	() => tempSettingValue.value,
	() => {
		buildTableOption(tempSettingValue.value);
	},
	{
		deep: true,
	}
);

function onConfig() {
	open.value = true;
}

function onSave() {
	setDate(cloneDeep(tempSettingValue.value));
	open.value = false;
	options.value.autoResize = true;
	options.value.height = 'auto';
	emit('update:config', cloneDeep(omit(options.value, 'data')));
	emit('setup');
}

function handleDisabled(bindDisabled: DatasourceContrast) {
	if (bindDisabled) {
		const { datasource } = props;
		const { type, key } = bindDisabled;
		if (type === 'customDatasource' && key) {
			return datasource[key]();
		}
	}
	return false;
}

function onCancel() {
	toolButtons.value = rawToolButtons.value;
	tempSettingValue.value = {};
	open.value = false;
}

function handlePageChange(params: VxePagerDefines.PageChangeEventParams) {
	emit('pageChange', params);
}
</script>
