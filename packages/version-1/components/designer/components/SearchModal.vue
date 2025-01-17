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
		:ok-button-props="{
			disabled: !currentSelectItem,
		}"
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
								'is-active': item.id === selectId,
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
									v-if="item.id === selectId"
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
						v-if="currentSelectItem"
						@click="onSave"
						type="primary"
						:size="'small'"
						:disabled="
							!currentSelectItem.statue || currentSelectItem.statue === 0
						"
						style="font-size: 12px; margin-left: 10px"
						:loading="saveLoading"
						>保存</Button
					>
				</div>
				<div
					v-if="currentSelectItem && currentSelectItem.type === 'script'"
					style="height: 100%"
				>
					<QuestionMarkCodemirror
						:key="currentSelectItem.id"
						:content="currentSelectItem.script"
						:extra-params="currentSelectItem.extraParams"
						@update:value="updateQuestionMarkValue"
					/>
				</div>
				<SqlEditor
					v-if="currentSelectItem && currentSelectItem.type === 'rule'"
					:entity="entity"
					:key="currentSelectItem.id"
					:value="JSON.parse(currentSelectItem.rule!!)"
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
import { computed, ref, watch } from 'vue';
import { cloneDeep, get, uniqueId } from 'lodash-es';
import { Condition, isString } from '@lt-frame/utils';
import { useMessage } from '@lt-frame/hooks';
import { LtHttp } from '../../../configs';
import SqlEditor from './sql-editor.vue';
import { SearchCondition } from './search-modal';
import QuestionMarkCodemirror from './question-mark-codemirror.vue';
import { generateHqlWhereClause } from './util';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	tUid: String,
	entity: String,
	open: Boolean,
	sql: String,
});

// 查询条件列表
const searchConditions = ref<SearchCondition[]>([]);

// 当前选中的查询条件id
const selectId = ref();

const emit = defineEmits(['update:open', 'ok', 'cancel']);

const openSearch = computed({
	get: () => props.open,
	set: (value) => emit('update:open', value),
});

// 打开时，查询服务端保存的查询条件
watch(openSearch, () => {
	openSearch.value && postConfig();
});

// 当前选中的查询条件
const currentSelectItem = computed((): SearchCondition => {
	const item = searchConditions.value.find(
		(item) => item.id === selectId.value
	);
	return item as SearchCondition;
});

/**
 * 选择查询条件
 * @param item
 */
function onSelect(item: SearchCondition) {
	selectId.value = item.id;
}

/**
 * 新增查询条件
 * @param e
 */
const handleMenuClick: MenuProps['onClick'] = (e) => {
	const id = uniqueId('$add');
	// 新增规则引擎查询条件
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
	// 新增脚本查询条件
	if (e.key === '2') {
		searchConditions.value.push({
			tUid: props.tUid,
			id,
			type: 'script',
			statue: 1,
			title: '查询脚本',
		});
	}
	selectId.value = id;
};

/**
 * 更新查询条件标题
 * @param v
 */
function updateTitle(v: any) {
	const arr = searchConditions.value.map((item) => {
		if (item.id === selectId.value) {
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

/**
 * 更新规则引擎查询条件
 * @param data
 */
function updateRule(data: any) {
	const arr = searchConditions.value.map((item) => {
		const statue = item.statue === 1 ? 1 : 2;
		if (item.id === selectId.value) {
			return {
				...item,
				rule: JSON.stringify(data),
				statue,
			};
		}
		return item;
	});
	searchConditions.value = arr;
}

/**
 * sql编辑器的值
 * @param data
 */
function updateQuestionMarkValue(data: { script: string; extraParams: any[] }) {
	const arr = searchConditions.value.map((item) => {
		const statue = item.statue === 1 ? 1 : 2;
		if (item.id === selectId.value) {
			return {
				...item,
				script: data.script,
				extraParams: data.extraParams,
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

// 获取保存的查询条件
function postConfig() {
	const condition = new Condition();
	condition.prop('tUid', props.tUid);
	condition.setTargetClass('test.app.model.BsConfigQuery');
	LtHttp.post({
		url: 'api/bsConfigServiceImpl/findBsQuerys',
		data: [condition],
	}).then((data) => {
		searchConditions.value = data.map((item: SearchCondition) => ({
			...item,
			extraParams: isString(item.extraParams)
				? JSON.parse(item.extraParams)
				: item.extraParams,
		}));
	});
}

const saveLoading = ref(false);
function onSave() {
	const data = cloneDeep(currentSelectItem.value);
	if (data.type === 'script' && data.extraParams?.includes(undefined)) {
		createMessage.warning('请为所有问号设置参数');
		return;
	}
	if (currentSelectItem.value.id?.toString().includes('$add')) {
		delete data.id;
		delete data.statue;
	}
	saveLoading.value = true;
	LtHttp.post(
		{
			url: 'api/bsConfigServiceImpl/saveBsConfigQuerys',
			data: [[data]],
		},
		{ isParameters: true }
	)
		.then((data) => {
			const arr = searchConditions.value.map((item) => {
				if (item.id === selectId.value) {
					return {
						...get(data, '0.0'),
						extraParams: isString(item.extraParams)
							? JSON.parse(item.extraParams)
							: item.extraParams,
					};
				}
				return item;
			});
			selectId.value = get(data, '0.0.id');
			searchConditions.value = arr;
		})
		.finally(() => {
			saveLoading.value = false;
		});
}

const { createMessage } = useMessage();
function onOk() {
	let params: { expression?: string; params?: any[] } = {};
	if (currentSelectItem.value) {
		if (currentSelectItem.value.type === 'rule') {
			const { clause, args } = generateHqlWhereClause(
				JSON.parse(currentSelectItem.value.rule!!)[0]
			);
			if (args) {
				const argsList = args.map((item: any) => {
					if (isString(item)) {
						return item;
					}
					if (item.type === 'Date') {
						return {
							type: 'Date',
							value: new Date(item.value).getTime(),
						};
					}
				});
				params = {
					expression: clause,
					params: argsList,
				};
			}
		} else {
			const { script, extraParams } = currentSelectItem.value;
			if (!script || script.trim() === '') {
				createMessage.warning('请输入查询脚本');
				return;
			}
			// 判断参数中是否存在undefined
			if (extraParams?.some((param) => param === undefined)) {
				createMessage.warning('问号对应的参数不能为空');
				return;
			}
			params = {
				expression: script,
				params: extraParams?.map((item) => ({
					type: 'Date',
					value: item,
				})),
			};
		}
	}

	emit('ok', params);
	openSearch.value = false;
}

function onCancel(v: any) {
	if (v.target.innerText === '移 除') {
		selectId.value = undefined;
		emit('cancel');
	}
}
</script>
