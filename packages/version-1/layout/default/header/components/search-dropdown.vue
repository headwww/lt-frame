<template>
	<div class="lt-pcn-dropdown">
		<div
			class="lt-pcn-header"
			@mousemove="onMouse(-1)"
			@click="onSuperSearch"
			:style="{
				background:
					selectedIndex === -1 ? 'rgb(242 243 245)' : 'rgb(255 255 255)',
			}"
		>
			<div class="lt-pcn-header-icon">
				<SearchOutlined
					style="color: #f0f4ff; line-height: 28px; align-items: center"
				/>
			</div>
			<span
				style="
					color: rgb(31 35 41);
					font-weight: 500;
					font-size: 14px;
					margin-left: 12px;
				"
				>{{ getText }}</span
			>
		</div>
		<div
			class="lt-pcn-box"
			:style="{
				maxHeight: `${height / 2.5}px`,
			}"
			ref="scrollableDiv"
		>
			<div class="lt-pcn-history" v-if="history.length > 0">
				<div class="lt-pcn-history-header">
					<span class="lt-pcn-item-title">搜索历史</span>
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
					></Button>
				</div>
				<div class="lt-pcn-history-content">
					<div
						class="lt-pcn-his-item"
						v-for="(item, index) in history"
						:key="index"
						@click="onHistoryItem(item)"
						@mousemove="onMouse(index)"
						:style="{
							background:
								selectedIndex === index ? '#e0e1e2' : 'rgb(242 243 245)',
						}"
					>
						{{ item }}
					</div>
				</div>
			</div>
			<Spin :spinning="spinning" :delay="500" wrapperClassName="lt-pcn-spin">
				<div class="lt-pcn-common">
					<span
						v-if="!isSearch && optionalItem.length === 0 && !spinning"
						style="color: #b9bbbd; font-weight: 500; font-size: 12px"
					>
						{{ `没有找到与 “${input}” 匹配的结果，请尝试搜索其他关键词` }}
					</span>
					<template v-for="(item, itemIndex) in optionalItem" :key="item.title">
						<div class="lt-pcn-common-header">
							<span class="lt-pcn-item-title">{{ item.title }}</span>
						</div>
						<div class="lt-pcn-common-content">
							<div
								v-for="(option, index) in item.searchResult"
								:key="index"
								@click="onItem(option)"
								class="lt-pcn-common-content-item"
								@mousemove="
									onMouse(index + history.length + optionalOffset(itemIndex))
								"
								:style="{
									background:
										selectedIndex ===
										index + history.length + optionalOffset(itemIndex)
											? 'rgb(242 243 245)'
											: 'rgb(255 255 255)',
								}"
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
					</template>
				</div>
			</Spin>
		</div>
		<div ref="dsasa" class="lt-pcn-footer">
			<div style="overflow: hidden; text-overflow: ellipsis; white-space: pre">
				↑↓ 移动光标 | Enter 选择条目 | Ctrl/⌘+Shift+F 新窗口打开
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { Button, Spin } from 'ant-design-vue';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons-vue';
import { computed, h, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useMagicKeys, useWindowSize } from '@vueuse/core';
import axios from 'axios';
import { LtIcon } from '@lt-frame/components';
import { smoothScroll } from '@lt-frame/utils';
import { SearchResult } from '../../../../types';
import { LtSuperSearch } from '../../../../searchStore';
import { LtHttp } from '../../../../configs';

defineOptions({
	inheritAttrs: false,
});

const emit = defineEmits(['select', 'update:input']);

const props = defineProps({
	input: String,
});

const history = ref<string[]>([]);

const scrollableDiv = ref<HTMLDivElement>();

const { height } = useWindowSize();

const { current } = useMagicKeys();

const spinning = ref(false);

// 查询到的可选项目
const optionalItem = ref<
	{
		title: string;
		searchResult: SearchResult[];
	}[]
>([]);

// 选中的条目，-1是选择超级搜索
const selectedIndex = ref(-2);

// 计算所有 searchResult 数组的长度总和
const totalLength = computed(() =>
	optionalItem.value.reduce((sum, item) => sum + item.searchResult.length, 0)
);

// 计算查询结果部分的偏移量
const optionalOffset = (itemIndex: number) =>
	optionalItem.value
		.slice(0, itemIndex)
		.reduce((sum, item) => sum + item.searchResult.length, 0);

const handleKeydown = (event: KeyboardEvent) => {
	const div = scrollableDiv.value;

	let targetScrollTop = 0;

	const totalItemCount = history.value.length + totalLength.value + 1; // 总项数：历史记录项 + 查询结果项 + 超级搜索项
	if (current.has('arrowup')) {
		event.preventDefault();
		if (selectedIndex.value === -1 || selectedIndex.value === -2) {
			return;
		}
		selectedIndex.value--;
		if (div) {
			targetScrollTop = div.scrollTop - 60;
		}
	}
	if (current.has('arrowdown')) {
		event.preventDefault();
		if (selectedIndex.value < totalItemCount - 2) {
			selectedIndex.value++;
		}
		if (div) {
			targetScrollTop = div.scrollTop + 60;
		}
	}
	if (selectedIndex.value > history.value.length) {
		smoothScroll(div, targetScrollTop, 200);
	}
	if (selectedIndex.value < history.value.length) {
		smoothScroll(div, 0, 200);
	}

	if (current.has('enter')) {
		event.preventDefault();
		onEnterSelect();
	}
};

// 处理选择逻辑
const onEnterSelect = () => {
	if (selectedIndex.value === -1) {
		// 执行超级搜索选择逻辑
		emit('select', { type: 'superSearch' });
	} else if (selectedIndex.value < history.value.length) {
		// 选择历史记录项
		onHistoryItem(history.value[selectedIndex.value]);
	} else {
		// 选择查询到的项目
		let resultIndex = selectedIndex.value - history.value.length; // 计算在查询结果中的偏移量
		for (const item of optionalItem.value) {
			if (resultIndex < item.searchResult.length) {
				// 找到目标项
				onItem(item.searchResult[resultIndex]);
				break;
			}
			resultIndex -= item.searchResult.length; // 移动偏移量到下一个分组
		}
	}
};

function onMouse(index: number) {
	selectedIndex.value = index;
}

function onHistoryItem(item: any) {
	emit('select', {
		type: 'history',
		params: item,
	});
}

function onSuperSearch() {
	emit('select', { type: 'superSearch' });
}

const isSearch = computed(
	() => props.input === undefined || props.input === ''
);

const getText = computed(() => {
	if (isSearch.value) {
		return '超级搜索';
	}
	return `在超级搜索中查看“${props.input}”`;
});

watch(
	() => props.input,
	() => {
		findDataset();
	},
	{ immediate: true }
);

function findDataset() {
	optionalItem.value.length = 0;
	history.value.length = 0;
	selectedIndex.value = -2;
	if (props.input !== undefined && props.input !== '') {
		spinning.value = true;
		const keys = Object.keys(LtSuperSearch.getStore());
		axios
			.all(
				keys.map((item) =>
					LtSuperSearch.get(item).createSearchMethod(props.input)
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
	} else {
		getUserHistoryList();
		getUserFavoriteList();
	}
}

function onItem(option: SearchResult) {
	emit('select', {
		type: 'item',
		params: { ...option },
	});
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
	optionalItem.value.length = 0;
	LtHttp.post({
		url: 'api/bsUserFavoriteService/getUserFavoriteList',
		data: [],
	}).then((data: any) => {
		optionalItem.value.push({
			title: '常用',
			searchResult: [...data.map((item: any) => ({ ...item }))],
		});
	});
}

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown);
});
</script>
