<template>
	<div
		style="
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		"
	>
		<template v-if="getIsInsert">
			<LtButton
				v-if="isActiveStatus()"
				@click="cancelRowEvent"
				:disabled="getEditDisabled"
				:style="{
					color: getEditDisabled ? '#d9d9d9' : '#f54a45',
				}"
				type="text"
				size="small"
				>删除</LtButton
			>
			<LtButton
				v-else
				@click="editRowEvent"
				:disabled="getEditDisabled"
				:style="{
					color: getEditDisabled ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				size="small"
				>编辑</LtButton
			>
		</template>
		<template v-else>
			<LtButton
				v-if="getViewVisible"
				:disabled="getViewDisabled"
				:style="{
					color: getViewDisabled ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				@click="handleViewClick"
				size="small"
				>查看</LtButton
			>
			<template v-if="getEditVisible">
				<LtButton
					v-if="isActiveStatus()"
					@click="cancelRowEvent"
					:disabled="getEditDisabled"
					:style="{
						color: getViewDisabled ? '#d9d9d9' : '#f54a45',
					}"
					type="text"
					size="small"
					>撤回</LtButton
				>
				<LtButton
					v-else
					@click="editRowEvent"
					:disabled="getEditDisabled"
					:style="{
						color: getViewDisabled ? '#d9d9d9' : '#3370ff',
					}"
					type="text"
					size="small"
					>编辑</LtButton
				>
			</template>

			<LtButton
				v-for="item in getButtons"
				:disabled="handleDisabled(item.disabled)"
				:style="{
					color: handleDisabled(item.disabled) ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				size="small"
				:key="item.event"
				@click="handleButtonsItemClick(item.event)"
				>{{ item.text }}</LtButton
			>

			<LtDropdown
				:trigger="['hover']"
				v-if="getMenus.length > 0"
				@menu-event="handleMenuEvent"
				:dropMenuList="handleMenuDisabled(getMenus)"
			>
				<Button
					style="color: #3370ff"
					type="text"
					size="small"
					:icon="h(EllipsisOutlined)"
				></Button>
			</LtDropdown>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { Button } from 'ant-design-vue';
import { LtButton } from '@lt-frame/components/button';
import { computed, h } from 'vue';
import { isFunction, isUndefined } from 'lodash-es';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Fn } from '@lt-frame/utils';
import { operateProps } from './operate';
import { DropMenu, LtDropdown } from '../../../dropdown';

const props = defineProps(operateProps);

const emit = defineEmits(['viewClick', 'buttonsItemClick', 'menusItemClick']);

function handleMenuEvent(menu: DropMenu) {
	const { params } = props;
	emit('buttonsItemClick', menu.event, params);
}

function handleButtonsItemClick(event?: string | number) {
	const { params } = props;
	emit('buttonsItemClick', event, params);
}

function handleViewClick() {
	const { params } = props;
	emit('viewClick', params);
}

const getMenus = computed(() => {
	const { menus, params } = props;
	if (menus) {
		// 剔除不显示的菜单
		const vMenus = menus.filter((item) => {
			const { visible } = item;
			if (!isUndefined(visible)) {
				if (isFunction(visible)) {
					return visible(params?.row);
				}
				return visible;
			}
			// 默认显示
			return true;
		});
		return vMenus;
	}
	return [];
});

function handleMenuDisabled(menus: Array<any>) {
	const arr: Array<any> = [];
	menus.forEach((item) => {
		arr.push({
			...item,
			disabled: handleDisabled(item.disabled),
		});
	});
	return arr;
}

const getButtons = computed(() => {
	const { buttons, params } = props;
	if (buttons) {
		// 剔除不显示的按钮
		const mButtons = buttons.filter((item) => {
			const { visible } = item;
			if (!isUndefined(visible)) {
				if (isFunction(visible)) {
					return visible(params?.row);
				}
				return visible;
			}
			// 默认显示
			return true;
		});
		return mButtons;
	}
	return [];
});

function handleDisabled(disabled?: boolean | Fn<any>): boolean {
	if (isFunction(disabled)) {
		return disabled(props.params?.row);
	}
	return disabled as boolean;
}

const getViewVisible = computed(() => {
	const { viewVisible, params } = props;
	if (viewVisible) {
		if (isFunction(viewVisible)) {
			return viewVisible(params?.row);
		}
		return viewVisible;
	}
	return false;
});

const getViewDisabled = computed(() => {
	const { viewDisabled, params } = props;
	if (viewDisabled) {
		if (isFunction(viewDisabled)) {
			return viewDisabled(params?.row);
		}
		return viewDisabled;
	}
	return false;
});

const getEditVisible = computed(() => {
	const { editVisible, params } = props;
	if (editVisible) {
		if (isFunction(editVisible)) {
			return editVisible(params?.row);
		}
		return editVisible;
	}
	return false;
});

const getEditDisabled = computed(() => {
	const { editDisabled, params } = props;
	if (editDisabled) {
		if (isFunction(editDisabled)) {
			return editDisabled(params?.row);
		}
		return editDisabled;
	}
	return false;
});

/** 判断是否是新增的数据，如果是新增的数据只显示删除按钮 */
const getIsInsert = computed(() => {
	const { $table, row } = props.params!!;
	return $table.isInsertByRow(row);
});

/** 是否是编辑状态 */
function isActiveStatus() {
	const { $table, row } = props.params!!;
	if ($table && row) {
		return $table.isEditByRow(row);
	}
	return false;
}

/** 开启编辑 */
const editRowEvent = async () => {
	const { $table, row } = props.params!!;
	if ($table) {
		$table.setEditRow(row);
	}
};

/** 取消编辑并还原数据 */
async function cancelRowEvent() {
	const { $table, row } = props.params!!;
	if ($table) {
		await $table.clearEdit();
		if ($table.isInsertByRow(row)) {
			$table.remove(row);
		} else {
			await $table.revertData(row);
		}
	}
}
</script>
