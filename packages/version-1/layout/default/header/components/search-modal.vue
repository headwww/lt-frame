<template>
	<LtModal
		title="应用组设置"
		width="900px"
		v-model:open="mOpen"
		:closable="false"
		:canFullscreen="false"
		destroyOnClose
		wrap-class-name="lt-header-search-modal"
	>
		<template #title>
			<Input
				size="large"
				autofocus
				allow-clear
				@input="onInput"
				v-model:value="inputValue"
				placeholder="搜索菜单导航、组织数据、数据字典..."
				style="border-radius: 20px"
			>
				<template #prefix>
					<SearchOutlined style="color: #8f959e" />
				</template>
				<template #suffix>
					<Tooltip title="关闭窗口">
						<CloseOutlined style="color: #8f959e" @click="mOpen = !mOpen" />
					</Tooltip>
				</template>
				<template #clearIcon>
					<span style="color: #d2d3d4; font-size: 14px; font-weight: 400"
						>清除 ｜</span
					>
				</template>
			</Input>
			<Tabs class="lt-header-search-modal-tab" v-model:active-key="tabKey">
				<TabPane :key="'综合'" :tab="'综合'"></TabPane>
				<TabPane
					v-for="item in Object.keys(LtSuperSearch.getStore())"
					:key="item"
					:tab="getTabTitle(item)"
				></TabPane>
			</Tabs>
		</template>
		<div style="height: 480px">
			<div v-if="!spinning && isEmpty">
				<div
					style="
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					"
					class="cut-scenes-loade"
				></div>
				<div
					style="
						position: absolute;
						left: 50%;
						top: 57%;
						color: rgb(100 106 110);
						font-size: 14px;
						transform: translate(-50%, -50%);
						margin-right: -150px;
					"
				>
					{{
						inputValue
							? '未找到匹配的结果，请尝试搜索其他关键词'
							: '请输入关键词查找功能'
					}}
				</div>
			</div>
			<!-- 常规页面 输入框为空时显示 -->
			<div v-if="tabKey === '综合'">
				<div v-if="!trim(inputValue)">
					<!-- 未输入内容的时候显示常用和历史搜索 -->
					<div class="lt-header-search-modal-history" v-if="history.length > 0">
						<!-- 历史搜索 -->
						<div class="lt-his-header">
							<span>搜索历史</span>
							<Button
								:size="'small'"
								style="margin: 12px"
								@click="onRemoveHistory"
								:icon="
									h(DeleteOutlined, {
										style: {
											color: '#8f959e',
										},
									})
								"
								type="text"
							/>
						</div>
						<div class="lt-his-content">
							<Space>
								<div
									v-for="(item, index) in history"
									:key="index"
									@click="
										() => {
											inputValue = item;
											findDataset();
										}
									"
									class="lt-his-content-item"
								>
									{{ item }}
								</div>
							</Space>
						</div>
					</div>
					<div class="lt-his-header">
						<span>常用</span>
					</div>
					<div class="lt-header-search-modal-content">
						<div
							class="lt-header-search-modal-content-item"
							v-for="(option, index) in commonItem"
							@click="onSelect(option)"
							:key="index"
						>
							<div style="display: flex; gap: 12px">
								<div
									class="lt-pcn-cci-icon"
									:style="{
										background: option.color,
									}"
								>
									<LtIcon
										:icon="option.icon"
										:color="option.color ? '#fff' : undefined"
									/>
								</div>
								<div>
									<div
										class="lt-pcn-cci-title"
										:style="{
											lineHeight: option.label ? '22px' : '44px',
										}"
									>
										{{ option.title }}
									</div>
									<div v-if="option.label" class="lt-pcn-label">
										{{ option.label }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<Spin style="height: 480px" :spinning="spinning">
						<!-- 输入内容后显示搜索的结果 -->
						<div v-for="item in optionalItem" :key="item.title">
							<div class="lt-his-header">
								<span>{{ item.title }}</span>
							</div>
							<div class="lt-header-search-modal-content">
								<div
									class="lt-header-search-modal-content-item"
									v-for="(option, index) in item.searchResult"
									@click="onSelect(option)"
									:key="index"
								>
									<div style="display: flex; gap: 12px">
										<div
											class="lt-pcn-cci-icon"
											:style="{
												background: option.color,
											}"
										>
											<LtIcon
												:icon="option.icon"
												:color="option.color ? '#fff' : undefined"
											/>
										</div>
										<div>
											<div
												class="lt-pcn-cci-title"
												:style="{
													lineHeight: option.label ? '22px' : '44px',
												}"
											>
												{{ option.title }}
											</div>
											<div v-if="option.label" class="lt-pcn-label">
												{{ option.label }}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</Spin>
				</div>
			</div>
			<!-- 搜索结果页面 -->
			<div v-else>
				<Spin style="height: 480px" :spinning="spinning">
					<div class="lt-header-search-modal-content">
						<div
							class="lt-header-search-modal-content-item"
							v-for="(option, index) in optionalItem.find(
								(o) => o.title === tabKey
							)?.searchResult"
							@click="onSelect(option)"
							:key="index"
						>
							<div style="display: flex; gap: 12px">
								<div
									class="lt-pcn-cci-icon"
									:style="{
										background: option.color,
									}"
								>
									<LtIcon
										:icon="option.icon"
										:color="option.color ? '#fff' : undefined"
									/>
								</div>
								<div>
									<div
										class="lt-pcn-cci-title"
										:style="{
											lineHeight: option.label ? '22px' : '44px',
										}"
									>
										{{ option.title }}
									</div>
									<div v-if="option.label" class="lt-pcn-label">
										{{ option.label }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</Spin>
			</div>
		</div>
		<template #footer>
			<div class="lt-header-search-modal-footer">
				<!-- <span> ↑↓ 移动光标 | Enter 选择条目 | Esc 关闭窗口 </span> -->
				<span> Esc 或 Ctrl/⌘+Shift+F 关闭窗口 </span>
			</div>
		</template>
	</LtModal>
</template>

<script lang="ts" setup>
import {
	CloseOutlined,
	DeleteOutlined,
	SearchOutlined,
} from '@ant-design/icons-vue';
import { LtIcon, LtModal } from '@lt-frame/components';
import {
	Input,
	Tabs,
	TabPane,
	Spin,
	Button,
	Space,
	Tooltip,
} from 'ant-design-vue';
import { ref, watch, h, computed } from 'vue';
import { debounce, trim } from 'lodash-es';
import axios from 'axios';
import { SearchResult } from '../../../../types';
import { LtSuperSearch } from '../../../../searchStore';
import { LtHttp } from '../../../../configs';

import { useGo } from '../../../../hooks';

defineOptions({
	inheritAttrs: false,
});

const props = defineProps({
	open: Boolean,
});

const emit = defineEmits(['update:open']);

const mOpen = ref(props.open);

const tabKey = ref('综合');

const inputValue = ref();

const spinning = ref(false);

const history = ref<string[]>([]);

// 查询到的可选项目
const optionalItem = ref<
	{
		title: string;
		searchResult: SearchResult[];
	}[]
>([]);

// 常用的菜单列表
const commonItem = ref<SearchResult[]>([]);

watch(
	() => props.open,
	(v) => {
		mOpen.value = props.open;
		if (v) {
			getUserFavoriteList();
			getUserHistoryList();
		} else {
			inputValue.value = undefined;
			optionalItem.value.length = 0;
			tabKey.value = '综合';
		}
	}
);

watch(
	() => mOpen.value,
	() => {
		emit('update:open', mOpen.value);
	}
);

watch(inputValue, () => {
	spinning.value = true;
});

function getTabTitle(title: string) {
	optionalItem.value.forEach((item) => {
		if (item.title === title) {
			title = `${title}(${item.searchResult.length})`;
		}
	});
	return title;
}

const isEmpty = computed(() => {
	if (inputValue.value) {
		if (tabKey.value === '综合') {
			return optionalItem.value.length === 0;
		}
		const select = optionalItem.value.find(
			(item) => item.title === tabKey.value
		);
		if (select) {
			return select.searchResult.length === 0;
		}
		return true;
	}
	if (tabKey.value === '综合') {
		return false;
	}
	return true;
});

const onInput = debounce(() => {
	findDataset();
}, 500);

function getUserHistoryList() {
	history.value.length = 0;
	LtHttp.post({
		url: 'api/bsUserHistoryService/getUserHistoryList',
		data: [],
	}).then((data: any) => {
		history.value.push(...data.map((item: any) => item.hisInfo));
	});
}

function getUserFavoriteList() {
	commonItem.value.length = 0;
	LtHttp.post({
		url: 'api/bsUserFavoriteService/getUserFavoriteList',
		data: [],
	}).then((data: any) => {
		commonItem.value.push(...data.map((item: any) => ({ ...item })));
	});
}

function findDataset() {
	optionalItem.value.length = 0;
	if (trim(inputValue.value)) {
		spinning.value = true;
		const keys = Object.keys(LtSuperSearch.getStore());
		axios
			.all(
				keys.map((item) =>
					LtSuperSearch.get(item).createSearchMethod(inputValue.value)
				)
			)
			.then(
				axios.spread((...resp: any[]) => {
					resp.forEach((item, index) => {
						if (item.length > 0) {
							optionalItem.value.push({
								title: keys[index],
								searchResult: item,
							});
						}
					});
				})
			)
			.finally(() => {
				spinning.value = false;
			});
	}
}

function onRemoveHistory() {
	LtHttp.post(
		{
			url: 'api/bsUserHistoryService/deleteBsUserHistorys',
			data: [],
		},
		{ isParameters: true, errorMessageMode: 'none' }
	).then(() => {
		getUserHistoryList();
	});
}

const go = useGo();

function onSelect(params: SearchResult) {
	saveBsUserFavorites(params);
	saveBsUserHistorys();
	go({
		name: params.name,
		query: {
			data: params.params,
		},
	});
	mOpen.value = false;
}

function saveBsUserFavorites(data: SearchResult) {
	LtHttp.post(
		{
			url: 'api/bsUserFavoriteService/saveBsUserFavorites',
			data: [[data]],
		},
		{ isParameters: true, errorMessageMode: 'none', noClearData: true }
	);
}

function saveBsUserHistorys() {
	if (inputValue.value !== undefined && inputValue.value !== '') {
		LtHttp.post(
			{
				url: 'api/bsUserHistoryService/saveBsUserHistorys',
				data: [
					[
						{
							hisInfo: inputValue.value,
						},
					],
				],
			},
			{ isParameters: true, errorMessageMode: 'none', noClearData: true }
		);
	}
}
</script>
