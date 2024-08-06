<template>
	<Modal
		v-model:open="openSearch"
		centered
		width="1000px"
		title="设置查询条件"
		destroy-on-close
		:okButtonProps="{
			disabled: okButtonDisabled,
		}"
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
						v-if="getItem"
						@click="onSave"
						type="primary"
						:size="'small'"
						:disabled="!getItem.statue || getItem.statue === 0"
						style="font-size: 12px"
						:loading="saveLoading"
						>保存</Button
					>
				</div>
				<Codemirror
					v-if="getItem && getItem.type === 'script'"
					:style="{ height: '100%' }"
					:extensions="[SQL()]"
					:model-value="getItem.script"
					@update:model-value="updateScript"
				>
				</Codemirror>
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
import { computed, ref, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { sql as SQL } from '@codemirror/lang-sql';
import { cloneDeep, get, uniqueId } from 'lodash-es';
import { Condition } from '@lt-frame/utils';
import { LtHttp } from '../../../configs';

import SqlEditor from './sql-editor.vue';
import { generateHqlWhereClause } from './util';

interface SearchCondition {
	// id
	id?: string | number;
	// id
	queryUid?: string | number;

	// 关联的table
	tUid?: string | number;

	// 脚本或者规则引擎
	type?: 'script' | 'rule';

	title?: string;

	rule?: string;

	script?: string;
	// 0是常规 1是新增 2是修改
	statue?: number;
}

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	tUid: String,
	entity: String,
	open: Boolean,
	sql: String,
});

const emit = defineEmits(['update:open', 'update:sql']);

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

const okButtonDisabled = computed(() => {
	if (getItem.value) {
		return getItem.value.statue === 1 || getItem.value.statue === 2;
	}
	return true;
});
const searchConditions = ref<SearchCondition[]>([]);

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

function onOk() {
	let code = '';
	if (getItem.value) {
		if (getItem.value.type === 'rule') {
			code = generateHqlWhereClause(JSON.parse(getItem.value.rule!!)[0]);
		} else {
			code = getItem.value.script ? getItem.value.script : '';
		}
	}
	emit('update:sql', code);
	openSearch.value = false;
}

function onCancel(v: any) {
	if (v.target.innerText === '移 除') {
		selectKey.value = undefined;
		emit('update:sql', undefined);
	}
}
</script>
