<template>
	<vxe-pulldown
		popup-class-name="lt-pcn-search"
		ref="pulldownRef"
		placement="bottom"
		transfer
		destroyOnClose
	>
		<template #default>
			<a-input
				ref="inputDiv"
				style="width: 400px"
				size="large"
				@focus="onfocus"
				allow-clear
				v-model:value="inputValue"
				placeholder="搜索菜单导航、组织数据、数据字典..."
				@input="onInput"
			>
				<template #prefix>
					<SearchOutlined style="color: #8f959e" />
				</template>
			</a-input>
		</template>
		<template #dropdown>
			<SearchDropdown :input="searchValue" @select="onSelect"></SearchDropdown>
		</template>
	</vxe-pulldown>
	<SearchModal v-model:open="open"></SearchModal>
</template>

<script lang="ts" setup>
import { Input as AInput } from 'ant-design-vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { VxePulldownInstance } from 'vxe-pc-ui';
import { useMagicKeys } from '@vueuse/core';
import { debounce } from 'lodash-es';
import SearchDropdown from './search-dropdown.vue';
import { LtHttp } from '../../../../configs';
import { SearchResult } from '../../../../types';
import { useGo } from '../../../../hooks';
import SearchModal from './search-modal.vue';

const inputValue = ref();

const searchValue = ref();

const inputDiv = ref();

const pulldownRef = ref<VxePulldownInstance>();

const go = useGo();

const open = ref(false);

function onfocus() {
	const $pulldown = pulldownRef.value;
	$pulldown?.showPanel();
}

function onSelect(item: {
	type: 'history' | 'item' | 'superSearch';
	params: SearchResult | string;
}) {
	if (item.type === 'history') {
		inputValue.value = item.params;
		searchValue.value = item.params;
	}
	if (item.type === 'item') {
		inputDiv.value?.blur();
		saveBsUserFavorites(item.params as SearchResult);
		saveBsUserHistorys();
		go({
			name: (item.params as SearchResult).name,
			query: {
				data: (item.params as SearchResult).params,
			},
		});
		const $pulldown = pulldownRef.value;
		$pulldown?.hidePanel();
	}
	if (item.type === 'superSearch') {
		const $pulldown = pulldownRef.value;
		$pulldown?.hidePanel();
		open.value = !open.value;
	}
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

const { current } = useMagicKeys();

const handleKeydown = (event: KeyboardEvent) => {
	if (
		current.has('shift') &&
		current.has('f') &&
		(current.has('control') || current.has('meta'))
	) {
		event.preventDefault();
		const $pulldown = pulldownRef.value;
		$pulldown?.hidePanel();
		open.value = !open.value;
	}
};

onMounted(() => {
	window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', handleKeydown);
});

const onInput = debounce(() => {
	searchValue.value = inputValue.value;
}, 500);
</script>
