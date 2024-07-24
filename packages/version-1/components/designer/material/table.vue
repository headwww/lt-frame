<template>
	<div :class="ns.b()">
		<Spin
			:wrapperClassName="ns.e('spin')"
			:spinning="spinning2"
			tip="加载配置..."
		>
			<div ref="container" :class="ns.e('container')">
				<div ref="toolBar" :class="ns.e('toolBar')">
					<div style="flex: 1 1 0%">
						<Button
							v-for="(button, index) in toolButtons"
							style="margin-right: 6px"
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
				<div
					ref="pagerBar"
					:style="{
						height: isPage ? '48px' : '3px',
					}"
				>
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
				<Designer :loading="loading" @cancel="onCancel" @save="onSave">
					<template #designer-pane>
						<div style="display: flex; margin: 12px">
							<div style="flex: 1 1 0%">
								<Button
									style="margin-right: 6px"
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
							style="padding: 5px"
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
import { cloneDeep, isArray, isFunction, isUndefined, omit } from 'lodash-es';
import { SettingOutlined } from '@ant-design/icons-vue';
import { VxePagerProps } from 'vxe-table';
import { useResizeObserver } from '@vueuse/core';
import { useNamespace } from '@lt-frame/hooks';
import { tableProps } from './table';
import { DatasourceContrast, TableFields, ToolButtons } from '../config';
import { useSetterAdapter } from '../use-setter-adapter';
import { useSchemas } from '../use-schemas';
import { findBsConfigTables, saveBsConfigTablesByString } from './api';

const ns = useNamespace('material-table');
const props = defineProps(tableProps);

const emit = defineEmits([
	'update:config',
	'update:listeners',
	'update:fields',
	'update:pager',
	'pageChange',
	'setup',
]);

const open = ref(false);

const spinning = ref(false);
const spinning2 = ref(false);

const loading = ref(false);

const container = ref<HTMLDivElement>();
const toolBar = ref<HTMLDivElement>();
const pagerBar = ref<HTMLDivElement>();
const tableStyle = ref();

useResizeObserver(container, (entries: any) => {
	const entry = entries[0];
	const { height } = entry.contentRect;
	if (isPage.value) {
		tableStyle.value = {
			height: `${height - 44 - 48}px`,
		};
	} else {
		tableStyle.value = {
			height: `${height - 44 - 3}px`,
		};
	}
});

// 临时的配置数据
const tempSettingValue = ref<TableFields>({
	tUid: props.tUid,
});

const rawToolButtons = ref();

const { options, gridEvents, toolButtons, buildTableOption } =
	useSetterAdapter(props);

const { schemas, buildSchemas } = useSchemas();

// 处理pager
const page = ref<VxePagerProps>(props.pager || {});

const isPage = computed(() => !isUndefined(props.pager));

const isSetup = ref(false);

watch(
	() => page.value,
	() => {
		emit('update:pager', page.value);
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

watch(
	() => open.value,
	() => {
		if (open.value) {
			spinning.value = true;
			findBsConfigTables(props.tUid)
				.then((data) => {
					if (isArray(data) && data.length > 0) {
						tempSettingValue.value = JSON.parse(data[0].tInfo);
						rawToolButtons.value = toolButtons.value;
					}
				})
				.catch(() => {})
				.finally(() => {
					spinning.value = false;
				});
		}
	}
);

onMounted(() => {
	spinning2.value = true;
	findBsConfigTables(props.tUid)
		.then((data) => {
			if (isArray(data) && data.length > 0) {
				tempSettingValue.value = JSON.parse(data[0].tInfo);
				isSetup.value = true;
			}
		})
		.catch(() => {})
		.finally(() => {
			spinning2.value = false;
		});
});

watch(
	() => tempSettingValue.value,
	() => {
		buildTableOption(tempSettingValue.value);
		if (isSetup.value) {
			isSetup.value = false;
			options.value.autoResize = true;
			options.value.height = 'auto';
			const fields: string[] = [];
			options.value.columns?.forEach((item: any) => {
				if (item.field) {
					fields.push(item.field);
				}
			});
			emit('update:fields', fields);
			emit('update:config', cloneDeep(omit(options.value, 'data')));
			emit('update:listeners', cloneDeep(gridEvents.value));
			emit('setup', fields);
		}
	},
	{
		deep: true,
	}
);

function onConfig() {
	open.value = true;
}

function onSave() {
	loading.value = true;
	saveBsConfigTablesByString(tempSettingValue.value)
		.then(() => {
			open.value = false;
			options.value.autoResize = true;
			options.value.height = 'auto';
			const fields: string[] = [];
			options.value.columns?.forEach((item: any) => {
				if (item.field) {
					fields.push(item.field);
				}
			});
			emit('update:fields', fields);
			emit('update:config', cloneDeep(omit(options.value, 'data')));
			emit('update:listeners', cloneDeep(gridEvents.value));
			emit('setup', fields);
		})
		.finally(() => {
			loading.value = false;
		});
}

function handleDisabled(bindDisabled: DatasourceContrast) {
	if (bindDisabled) {
		const { datasource } = props;
		const { type, key } = bindDisabled;
		if (type === 'customDatasource' && key) {
			if (isFunction(datasource[key])) {
				return datasource[key]();
			}
			return datasource[key];
		}
	}
	return false;
}

function onCancel() {
	toolButtons.value = rawToolButtons.value;
	tempSettingValue.value = { tUid: props.tUid };
	open.value = false;
}

function handlePageChange(params: any) {
	emit('pageChange', params);
}
</script>
