<template>
	<div :class="ns.b()">
		<slot name="headerTitle" v-if="slots.headerTitle"></slot>

		<LtTitle :helpMessage="helpMessage" v-if="!slots.headerTitle && title">
			{{ title }}
		</LtTitle>
		<div :class="ns.b('search')" v-if="search || toolbar">
			<div :style="getInputSearchStyle" v-if="search">
				<InputSearch
					:placeholder="'搜索'"
					allowClear
					v-model:value="searchValue"
				/>
			</div>

			<Dropdown @click.prevent v-if="toolbar">
				<MoreOutlined style="font-size: 18px"></MoreOutlined>
				<template #overlay>
					<Menu @click="handleMenuClick">
						<template v-for="item in toolbarList" :key="item.value">
							<MenuItem v-bind="{ key: item.value }">
								{{ item.label }}
							</MenuItem>
							<MenuDivider v-if="item.divider" />
						</template>
					</Menu>
				</template>
			</Dropdown>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { CSSProperties, PropType, computed, ref, useSlots, watch } from 'vue';
import {
	MenuProps,
	InputSearch,
	Dropdown,
	Menu,
	MenuItem,
	MenuDivider,
} from 'ant-design-vue';
import { useDebounceFn } from '@vueuse/core';
import { MoreOutlined } from '@ant-design/icons-vue';
import { LtTitle } from '../../basic';
import { ToolbarEnum } from './tree';

const ns = useNamespace('tree-header');
const searchValue = ref('');

const props = defineProps({
	helpMessage: {
		type: [String, Array] as PropType<string | string[]>,
		default: '',
	},
	title: {
		type: String,
		default: '',
	},
	toolbar: {
		type: Boolean,
		default: false,
	},
	checkable: {
		type: Boolean,
		default: false,
	},
	search: {
		type: Boolean,
		default: false,
	},
	searchText: {
		type: String,
		default: '',
	},
	checkAll: {
		type: Function,
		default: undefined,
	},
	expandAll: {
		type: Function,
		default: undefined,
	},
} as const);

const emit = defineEmits(['strictly-change', 'search']);

const slots = useSlots();

const getInputSearchStyle = computed(() => {
	const titleExists = slots.headerTitle || props.title;
	return {
		width: '100%',
		marginRight: '8px',
		marginLeft: titleExists ? '15px' : 0,
	} as CSSProperties;
});

const toolbarList = computed(() => {
	const { checkable } = props;
	const defaultToolbarList = [
		{ label: '展开全部', value: ToolbarEnum.EXPAND_ALL },
		{
			label: '折叠全部',
			value: ToolbarEnum.UN_EXPAND_ALL,
			divider: checkable,
		},
	];

	return checkable
		? [
				{ label: '选择全部', value: ToolbarEnum.SELECT_ALL },
				{
					label: '取消全部',
					value: ToolbarEnum.UN_SELECT_ALL,
					divider: checkable,
				},
				...defaultToolbarList,
				{ label: '层级关联', value: ToolbarEnum.CHECK_STRICTLY },
				{ label: '层级独立', value: ToolbarEnum.CHECK_UN_STRICTLY },
			]
		: defaultToolbarList;
});

const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
	switch (key) {
		case ToolbarEnum.SELECT_ALL:
			props.checkAll?.(true);
			break;
		case ToolbarEnum.UN_SELECT_ALL:
			props.checkAll?.(false);
			break;
		case ToolbarEnum.EXPAND_ALL:
			props.expandAll?.(true);
			break;
		case ToolbarEnum.UN_EXPAND_ALL:
			props.expandAll?.(false);
			break;
		case ToolbarEnum.CHECK_STRICTLY:
			emit('strictly-change', false);
			break;
		case ToolbarEnum.CHECK_UN_STRICTLY:
			emit('strictly-change', true);
			break;
	}
};

function emitChange(value?: string): void {
	emit('search', value);
}

const debounceEmitChange = useDebounceFn(emitChange, 200);

watch(
	() => searchValue.value,
	(v) => {
		debounceEmitChange(v);
	}
);

watch(
	() => props.searchText,
	(v) => {
		if (v !== searchValue.value) {
			searchValue.value = v;
		}
	}
);
</script>
