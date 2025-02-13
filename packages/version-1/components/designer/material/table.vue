<template>
	<div :class="ns.b()">
		<Spin
			:wrapperClassName="ns.e('spin')"
			:spinning="spinning2"
			tip="加载配置..."
		>
			<div :class="ns.e('container')">
				<div :class="ns.e('toolBar')">
					<div style="flex: 1 1 0%">
						<Button
							v-for="(button, index) in toolButtons"
							style="margin-right: 6px"
							:key="index"
							:type="button.type"
							@click="onButtonsClick(button)"
							:disabled="handleDisabled(button.bindDisabled)"
						>
							{{ button.title }}
						</Button>
					</div>
					<div>
						<Button
							shape="circle"
							:icon="h(SearchOutlined)"
							style="margin-right: 6px"
							@click="openSearch = true"
							:type="!hasQuery ? 'default' : 'primary'"
						></Button>
						<Button
							v-if="userStore.getClient?.user?.id === '1'"
							shape="circle"
							:icon="h(SettingOutlined)"
							@click="open = true"
						></Button>
					</div>
				</div>
				<div style="height: 100%">
					<slot name="table"> </slot>
				</div>
				<div
					:style="{
						height: isPager ? '48px' : '3px',
					}"
				>
					<vxe-pager
						v-if="isPager"
						v-model:current-page="innerPagerCurrentPage"
						v-model:page-size="innerPagerSize"
						v-model:total="innerPagerTotal"
						@page-change="handlePageChange"
					/>
				</div>
			</div>
		</Spin>

		<SearchModal
			:entity="entity"
			:tUid="tUid"
			v-model:open="openSearch"
			@ok="onQueryOk"
			@cancel="onQueryCancel"
		></SearchModal>
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
import { SearchOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useNamespace } from '@lt-frame/hooks';
import { tableProps, TableQueryParams } from './table';
import { DatasourceContrast, TableFields, ToolButtons } from '../config';
import { useSetterAdapter } from '../use-setter-adapter';
import { useSchemas } from '../use-schemas';
import {
	findBsConfigTables,
	getUserTablePermissionListByTable,
	saveBsConfigTablesByString,
} from './api';
import SearchModal from '../components/SearchModal.vue';
import { useUserStore } from '../../../stores';
import { queryParamsParserSql } from './utils';

const userStore = useUserStore();

const ns = useNamespace('material-table');

const props = defineProps(tableProps);

const emit = defineEmits([
	'update:config',
	'update:listeners',
	'update:fields',
	'update:pager',
	'update:queryParams',
	'pageChange',
	'queryChange',
	'setup',
	/**
	 * @deprecated 后期需要优化掉，使用queryParams替代
	 */
	'update:sql',
	/**
	 * @deprecated 后期需要优化掉，使用queryParams替代
	 */
	'sqlChange',
]);

const open = ref(false);
const openSearch = ref(false);

const innerQueryParams = computed({
	get: () => props.queryParams,
	set: (value) => {
		emit('update:queryParams', value);
	},
});
// TODO: 后期需要优化掉，使用queryParams替代
const innerSql = computed({
	get: () => props.sql,
	set: (value) => {
		emit('update:sql', value);
	},
});

function onQueryOk(params: TableQueryParams) {
	emit('update:queryParams', params);
	emit('queryChange', params);
	// TODO: queryParams转换为sql 后期需要优化掉，使用queryParams替代
	const sql = queryParamsParserSql(params);
	emit('update:sql', sql);
	emit('sqlChange', sql);
}

// 取消搜索
function onQueryCancel() {
	emit('update:queryParams', undefined);
	emit('queryChange', undefined);
	// TODO: queryParams转换为sql 后期需要优化掉，使用queryParams替代
	emit('update:sql', undefined);
	emit('sqlChange', undefined);
}

/**
 * @deprecated 后期需要优化掉，只需要判断queryParams即可
 */
const hasQuery = computed(
	() =>
		(innerQueryParams.value?.expression &&
			innerQueryParams.value.expression !== '') ||
		(innerSql.value && innerSql.value !== '')
);

const spinning = ref(false);
const spinning2 = ref(false);
const loading = ref(false);

// 临时的配置数据
const tempSettingValue = ref<TableFields>({
	tUid: props.tUid,
	tLabel: props.tLabel ? props.tLabel : props.tUid,
	parentMenu: props.tUid?.split('_')[0],
});

const rawToolButtons = ref();

const { options, gridEvents, toolButtons, buildTableOption } =
	useSetterAdapter(props);

const { schemas, buildSchemas } = useSchemas();

// table是否初始化完成
const isSetup = ref(false);

const innerPagerTotal = computed({
	get: () => props.pager?.total,
	set: (value) => {
		emit('update:pager', { ...props.pager, total: value });
	},
});

const innerPagerSize = computed({
	get: () => props.pager?.pageSize,
	set: (value) => {
		emit('update:pager', { ...props.pager, pageSize: value });
	},
});

const innerPagerCurrentPage = computed({
	get: () => props.pager?.currentPage,
	set: (value) => {
		emit('update:pager', { ...props.pager, currentPage: value });
	},
});

// 是否开启分页 判断是否设置了props.pager
const isPager = computed(() => !isUndefined(props.pager));

function handlePageChange(params: any) {
	emit('pageChange', params);
}

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
						tempSettingValue.value = {
							...tempSettingValue.value,
							...JSON.parse(data[0].tInfo),
						};
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
	getPermission();
});

/**
 * 查询有权限的按钮，字段，右键菜单
 */
function getPermission() {
	spinning2.value = true;
	if (props.tUid) {
		getUserTablePermissionListByTable(props.tUid)
			.then((data) => {
				if (isArray(data) && data.length > 0) {
					tempSettingValue.value = {
						...tempSettingValue.value,
						...JSON.parse(data[0].tInfo),
					};
					isSetup.value = true;
				}
			})
			.finally(() => {
				spinning2.value = false;
			});
	}
}

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

function onSave() {
	loading.value = true;
	saveBsConfigTablesByString(tempSettingValue.value)
		.then(() => {
			open.value = false;
			getPermission();
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
	tempSettingValue.value = {
		tUid: props.tUid,
		tLabel: props.tLabel ? props.tLabel : props.tUid,
		parentMenu: props.tUid?.split('_')[0],
	};
	open.value = false;
}
</script>
