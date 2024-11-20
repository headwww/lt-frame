<template>
	<Modal
		v-model:open="openSearch"
		centered
		width="1000px"
		title="设置查询条件"
		destroy-on-close
		:cancelButtonProps="{
			danger: true,
		}"
		cancel-text="移除"
		ok-text="查询"
		@ok="onOk"
		@cancel="onCancel"
	>
		<section class="lt-sce-section">
			<div class="lt-sce-l" style="width: 350px">
				<div class="lt-sce-header">
					<Dropdown>
						<a class="ant-dropdown-link" @click.prevent>
							新增查询
							<DownOutlined />
						</a>
						<template #overlay>
							<Menu @click="handleMenuClick">
								<MenuItem key="1"> 新增查询条件 </MenuItem>
								<MenuItem key="2"> 新增查询脚本 </MenuItem>
							</Menu>
						</template>
					</Dropdown>
				</div>

				<div class="lt-sce-menu">
					<template v-for="item in searchConditions" :key="item.id">
						<div
							class="lt-sce-title"
							:class="{
								'is-active': item.id === selectKey,
							}"
							@click="onSelect(item)"
						>
							<span
								v-if="item && item.statue && item.statue !== 0"
								class="lt-sce-circle"
								:style="{
									backgroundColor: item.statue === 1 ? '#019633' : '#db9834',
								}"
							></span>
							<div style="display: flex">
								<ApartmentOutlined
									v-if="item.type === 'rule'"
									style="font-size: 20px; color: #cc4165"
								></ApartmentOutlined>
								<ConsoleSqlOutlined
									v-else
									style="font-size: 20px; color: #6d3f80"
								></ConsoleSqlOutlined>
								<Input
									placeholder="请输入标题"
									style="margin-left: 8px; margin-right: 8px"
									v-if="item.id === selectKey"
									:value="item.title"
									@update:value="updateTitle"
								></Input>
								<span v-else style="font-size: 15px; margin-left: 8px">{{
									item.title
								}}</span>
							</div>

							<Button type="text" @click.stop="onDelete(item)">
								<template #icon
									><DeleteFilled style="color: #aab4c7"></DeleteFilled
								></template>
							</Button>
						</div>
					</template>
				</div>
			</div>
			<div class="lt-sce-r" style="border-left: 0 none; overflow: hidden">
				<div class="lt-sce-header" style="justify-content: flex-end">
					<Button
						v-if="getItem && getItem.type === 'script'"
						@click="onArgs"
						type="primary"
						:size="'small'"
						style="font-size: 12px; margin-left: 10px"
					>
						参数
					</Button>
					<Button
						v-if="getItem"
						@click="onSave"
						type="primary"
						:size="'small'"
						:disabled="!getItem.statue || getItem.statue === 0"
						style="font-size: 12px; margin-left: 10px"
						:loading="saveLoading"
						>保存</Button
					>
				</div>
				<div v-if="getItem && getItem.type === 'script'" style="height: 100%">
					<div style="height: 350px; overflow: scroll scroll; padding: 8px">
						<Codemirror
							v-if="getItem && getItem.type === 'script'"
							:style="{ height: '340px' }"
							:extensions="[SQL()]"
							:model-value="getItem.script"
							@update:model-value="updateScript"
						>
						</Codemirror>
					</div>
					<div
						v-if="getItem && getItem.type === 'script'"
						style="height: 100%; overflow: scroll scroll"
					>
						<vxe-table
							border
							size="mini"
							:show-header-overflow="true"
							height="100"
							:edit-config="{ mode: 'row', trigger: 'click' }"
							:data="argsData"
						>
							<vxe-column type="seq" width="60"></vxe-column>
							<vxe-column
								field="argValue"
								title="值"
								min-width="100"
								:edit-render="{ name: 'VxeInput' }"
							></vxe-column>
							<vxe-column
								field="argType"
								title="类型"
								width="200"
								:edit-render="argtypeEditRender"
							></vxe-column>
						</vxe-table>
					</div>
				</div>
				<SqlEditor
					v-if="getItem && getItem.type === 'rule'"
					:entity="entity"
					:value="JSON.parse(getItem.rule!!)"
					@update:value="updateRule"
				></SqlEditor>
			</div>
		</section>
	</Modal>
</template>
<script lang="ts" setup>
import {
	DeleteFilled,
	DownOutlined,
	ApartmentOutlined,
	ConsoleSqlOutlined,
} from '@ant-design/icons-vue';
import {
	Modal,
	Dropdown,
	Menu,
	MenuItem,
	MenuProps,
	Input,
	Button,
} from 'ant-design-vue';
import { computed, reactive, ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { sql as SQL } from '@codemirror/lang-sql';
import { cloneDeep, get, uniqueId } from 'lodash-es';
import { Condition } from '@lt-frame/utils';
import { VxeColumnPropTypes } from 'vxe-table';
import { useMessage } from '@lt-frame/hooks';
import { isString } from 'xe-utils';
import { LtHttp } from '../../../configs';

import SqlEditor from './sql-editor.vue';
import { generateHqlWhereClause } from './util';
import { SearchCondition } from './search-modal';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	tUid: String,
	entity: String,
	open: Boolean,
	sql: String,
});

const emit = defineEmits(['update:open', 'ok', 'cancel']);

const openSearch = ref(props.open);

watch(
	() => props.open,
	() => {
		openSearch.value = props.open;
	}
);

watch(
	() => openSearch.value,
	() => {
		if (openSearch.value) {
			postConfig();
		}
		emit('update:open', openSearch.value);
	}
);

const selectKey = ref();

function onSelect(item: SearchCondition) {
	selectKey.value = item.id;
}

const getItem = computed((): SearchCondition => {
	const item = searchConditions.value.find(
		(item) => item.id === selectKey.value
	);
	return item as SearchCondition;
});

// 2024-11-19 wyh 暂时查询按钮不控制变灰
// 下面代码原来在okButtonProps中
// :okButtonProps="{
// 			disabled: okButtonDisabled,
// 		}"
// const okButtonDisabled = computed(() => {
// 	if (getItem.value) {
// 		return  getItem.value.statue === 1 || getItem.value.statue === 2;
// 	}
// 	return true;
// });
const searchConditions = ref<SearchCondition[]>([]);

// 下拉选择两种类型的查询
const handleMenuClick: MenuProps['onClick'] = (e) => {
	const id = uniqueId('$add');
	if (e.key === '1') {
		searchConditions.value.push({
			tUid: props.tUid,
			id,
			type: 'rule',
			title: '查询条件',
			statue: 1,
			rule: JSON.stringify([
				{
					id: '1',
					type: 'group',
					children: [
						{
							id: '1-1',
							parentId: '1',
							type: 'single',
						},
					],
				},
			]),
		});
	}
	if (e.key === '2') {
		searchConditions.value.push({
			tUid: props.tUid,
			id,
			type: 'script',
			statue: 1,
			title: '查询脚本',
		});
	}
	selectKey.value = id;
};

function updateTitle(v: any) {
	const arr = searchConditions.value.map((item) => {
		if (item.id === selectKey.value) {
			const statue = item.statue === 1 ? 1 : 2;
			return {
				...item,
				title: v,
				statue,
			};
		}
		return item;
	});
	searchConditions.value = arr;
}

function updateRule(v: any) {
	const arr = searchConditions.value.map((item) => {
		const statue = item.statue === 1 ? 1 : 2;
		if (item.id === selectKey.value) {
			return {
				...item,
				rule: JSON.stringify(v),
				statue,
			};
		}
		return item;
	});
	searchConditions.value = arr;
}

function updateScript(v: any) {
	const arr = searchConditions.value.map((item) => {
		const statue = item.statue === 1 ? 1 : 2;
		if (item.id === selectKey.value) {
			return {
				...item,
				script: v,
				statue,
			};
		}
		return item;
	});
	searchConditions.value = arr;
}

// 删除库里的查询条件
function onDelete(params: SearchCondition) {
	if (params.id?.toString().includes('$add')) {
		const index = searchConditions.value.findIndex(
			(item) => item.id === params.id
		);
		searchConditions.value.splice(index, 1);
	} else {
		LtHttp.post(
			{
				url: 'api/bsConfigServiceImpl/deleteBsConfigQuerys',
				data: [[params]],
			},
			{ isParameters: true }
		).then(() => {
			const index = searchConditions.value.findIndex(
				(item) => item.id === params.id
			);
			searchConditions.value.splice(index, 1);
		});
	}
}

// 查询库里保存的查询条件
function postConfig() {
	const condition = new Condition();
	condition.prop('tUid', props.tUid);
	condition.setTargetClass('test.app.model.BsConfigQuery');
	LtHttp.post({
		url: 'api/bsConfigServiceImpl/findBsQuerys',
		data: [condition],
	}).then((data) => {
		searchConditions.value = data;
	});
}

const saveLoading = ref(false);
function onSave() {
	saveLoading.value = true;
	const data = cloneDeep(getItem.value);
	if (getItem.value.id?.toString().includes('$add')) {
		delete data.id;
		delete data.statue;
	}
	LtHttp.post(
		{
			url: 'api/bsConfigServiceImpl/saveBsConfigQuerys',
			data: [[data]],
		},
		{ isParameters: true }
	)
		.then((data) => {
			const arr = searchConditions.value.map((item) => {
				if (item.id === selectKey.value) {
					return {
						...get(data, '0.0'),
					};
				}
				return item;
			});
			selectKey.value = get(data, '0.0.id');
			searchConditions.value = arr;
		})
		.finally(() => {
			saveLoading.value = false;
		});
}

// #region 全脚本条件对应的参数处理
// 脚本语句的参数数据源
interface sqlArgDataItem {
	id: number;
	argValue: string;
	argType: string;
}

const argsData = ref<sqlArgDataItem[]>([]);

const argtypeEditRender = reactive<VxeColumnPropTypes.EditRender>({
	name: 'VxeSelect',
	options: [
		{ label: '常规类型', value: 'default' },
		{ label: '日期', value: 'Date' },
	],
});

// 点击参数按钮，要根据sql语句显示必须填入的参数列表
function onArgs() {
	if (getItem.value) {
		// sqlargOptions.value.data = data;
		// 根据 getItem.value.script内容中的sql语句的问号个数，提取参数列表
		// 提取参数列表
		const sql = getItem.value.script ? getItem.value.script : '';
		const reg = /\?/g;
		const arr = sql.match(reg);

		if (arr) {
			argsData.value.length = 0;
			argsData.value = [];
			arr.forEach((item, index) => {
				argsData.value.push({
					id: index + 1,
					argValue: '',
					argType: 'default',
				});
			});
		} else {
			argsData.value.length = 0;
			argsData.value = [];
		}
	}
}

function checkSqlArgs() {
	let isOk = 0;
	// 如果sql语句中问号个数与参数不相符，报错
	if (getItem.value) {
		// sqlargOptions.value.data = data;
		// 根据 getItem.value.script内容中的sql语句的问号个数，提取参数列表
		// 提取参数列表
		const sql = getItem.value.script ? getItem.value.script : '';
		const reg = /\?/g;
		const arr = sql.match(reg);
		if (arr && argsData.value.length !== arr.length) {
			isOk = 1;
			return isOk;
		}
	}
	// 检查参数列表中的参数是否为空
	argsData.value.forEach((item) => {
		if (item.argValue === '') {
			isOk = 2;
		}
	});

	// 检查如果参数类型为日期，填入的值是否为日期类型
	argsData.value.forEach((item) => {
		if (item.argType === 'Date') {
			const datestr = new Date(item.argValue).getTime();
			if (!datestr) {
				isOk = 3;
			}

			// if (isNaN(datestr)) {
			// 	isOk = 3;
			// }
		}
	});
	return isOk;
}

// #endregion

const { createMessage } = useMessage();

type argType =
	| {
			type: string;
			value: string;
	  }
	| string;
function onOk() {
	let code = '';
	let clauseArgs = {};
	let args: argType[] = [];

	const condition = new Condition();
	if (getItem.value) {
		if (getItem.value.type === 'rule') {
			// const node = JSON.parse(getItem.value.rule!!)[0];
			clauseArgs = generateHqlWhereClause(JSON.parse(getItem.value.rule!!)[0]);
			code = get(clauseArgs, 'clause') ?? '';
			args = get(clauseArgs, 'args') ?? [];
			const argStrList: argType[] = [];
			if (!args || args.length === 0) {
				condition.expr(code);
			} else {
				args.forEach((item) => {
					if (isString(item)) {
						argStrList.push(item);
					} else {
						if (item.type === 'Date') {
							const datestr = new Date(item.value).getTime();
							argStrList.push({
								type: 'Date',
								value: `${datestr}`,
							});
						}
					}
				});

				condition.expr(code, ...argStrList);
			}
		} else {
			// 脚本查询时，要判断是否有问号，以及参数是否为空
			const ret = checkSqlArgs();
			if (ret === 1) {
				createMessage.warning('问号个数与参数不相符');
				return;
			}
			if (ret === 2) {
				createMessage.warning('参数不能为空');
				return;
			}
			if (ret === 3) {
				createMessage.warning('参数必须为日期格式');
				return;
			}

			code = getItem.value.script ? getItem.value.script : '';
			if (!argsData.value || argsData.value.length === 0) {
				condition.expr(code);
			} else {
				const argStrList: any[] = [];
				argsData.value.forEach((item) => {
					if (item?.argType === 'Date') {
						const datestr = new Date(item.argValue).getTime();
						(argStrList as { type: string; value: string }[]).push({
							type: 'Date',
							value: `${datestr}`,
						});
					} else {
						(argStrList as {}[]).push(item.argValue);
					}
				});
				condition.expr(code, ...argStrList);
			}
		}
	}
	emit('ok', condition);
	openSearch.value = false;
}

function onCancel(v: any) {
	if (v.target.innerText === '移 除') {
		selectKey.value = undefined;
		emit('cancel');
	}
}
</script>
