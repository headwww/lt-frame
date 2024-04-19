<template>
	<div style="height: 40px; display: flex; align-items: center">
		<template v-for="(item, index) in getOptions">
			<template v-if="item.children && item.children.length > 0">
				<LtDropdown
					:key="index"
					:trigger="['hover']"
					:dropMenuList="getDropMenuList(item.children)"
					@menuEvent="handleItemClick"
				>
					<LtButton
						:preIcon="item.preIcon"
						:disabled="item.disabled"
						:key="index"
						:type="item.type"
						:class="item.className"
						v-if="item.visible !== false"
						>{{ item.text }}</LtButton
					>
				</LtDropdown>
				<div
					:key="'divider' + index"
					:style="{
						background: item.divider !== false ? '#c0c4cc' : '',
						width: '1px',
						height: '14px',
						marginLeft: '4px',
						marginRight: '4px',
					}"
				></div>
			</template>
			<template v-else>
				<LtButton
					:preIcon="item.preIcon"
					:disabled="item.disabled"
					:key="index"
					:type="item.type"
					:class="item.className"
					@click="handleItemClick(item)"
					v-if="item.visible !== false"
					>{{ item.text }}</LtButton
				>
				<div
					:key="'divider' + index"
					:style="{
						background: item.divider !== false ? '#c0c4cc' : '',
						width: '1px',
						height: '14px',
						marginLeft: '4px',
						marginRight: '4px',
					}"
				></div>
			</template>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { useMessage } from '@lt-frame/hooks';
import { last } from 'lodash-es';
import { computed } from 'vue';
import { LtButton } from '../../../button';
import {
	ToolMenuChildOption,
	toolFunctionProps,
	ToolButtonOptions,
} from './tool-function';
import { LtDropdown } from '../../../dropdown';

const props = defineProps(toolFunctionProps);

const defaulEvent = ['insert', 'save', 'refresh', 'reset', 'remove'];

const emit = defineEmits(['remove', 'save', 'refresh', 'itemClick']);

const { createMessage } = useMessage();

const getOptions = computed(() => {
	const map = props.options.map((item) => {
		const event =
			item.default && defaulEvent.includes(item.default)
				? item.default
				: item.event;
		const children =
			item.children &&
			item.children.map((childrenItem) => {
				const childrenEvent =
					childrenItem.default && defaulEvent.includes(childrenItem.default)
						? childrenItem.default
						: childrenItem.event;
				return {
					...childrenItem,
					event: childrenEvent,
				};
			});

		return {
			...item,
			event,
			children,
		};
	});
	return map as unknown as ToolButtonOptions[];
});
const handleItemClick = (item: any) => {
	if (item.event === 'save') {
		save();
	} else if (item.event === 'refresh') {
		refresh();
	} else if (item.event === 'insert') {
		insert();
	} else if (item.event === 'reset') {
		cleanFilter();
	} else if (item.event === 'remove') {
		remove();
	} else {
		emit('itemClick', item.event, props.params);
	}
};

const getDropMenuList = (children: ToolMenuChildOption[]): any => {
	const menus = children.map((item) => ({
		text: item.text,
		icon: item.preIcon,
		event: item.event,
		disabled: item.disabled,
	}));
	return menus;
};
/** 插入一条数据 */
function insert() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			$grid.insert({});
			const { insertRecords } = $grid.getRecordset();
			$grid.setEditRow(last(insertRecords));
		}
	}
}

/** 保存数据 */
async function save() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			const validate = await $grid.validate();
			if (validate) {
				createMessage.warning('字段验证失败');
				return;
			}
			emit('save', params);
		}
	}
}

/** 清除筛条件 */
function cleanFilter() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			$grid.clearFilter();
		}
	}
}

/** 删除 */
function remove() {
	const { params } = props;
	if (params) {
		emit('remove', params);
	}
}

/** 刷新 */
function refresh() {
	const { params } = props;
	if (params) {
		emit('refresh', params);
	}
}
</script>
