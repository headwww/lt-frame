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
			<LTButton
				v-if="isActiveStatus()"
				@click="cancelRowEvent"
				:disabled="getEditDisabled"
				:style="{
					color: getViewDisabled ? '#d9d9d9' : '#f54a45',
				}"
				type="text"
				size="small"
				>删除</LTButton
			>
			<LTButton
				v-else
				@click="editRowEvent"
				:disabled="getEditDisabled"
				:style="{
					color: getViewDisabled ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				size="small"
				>编辑</LTButton
			>
		</template>
		<template v-else>
			<LTButton
				v-if="getViewVisible"
				:disabled="getViewDisabled"
				:style="{
					color: getViewDisabled ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				@click="handleViewClick"
				size="small"
				>查看</LTButton
			>
			<template v-if="getEditVisible">
				<LTButton
					v-if="isActiveStatus()"
					@click="cancelRowEvent"
					:disabled="getEditDisabled"
					:style="{
						color: getViewDisabled ? '#d9d9d9' : '#f54a45',
					}"
					type="text"
					size="small"
					>撤回</LTButton
				>
				<LTButton
					v-else
					@click="editRowEvent"
					:disabled="getEditDisabled"
					:style="{
						color: getViewDisabled ? '#d9d9d9' : '#3370ff',
					}"
					type="text"
					size="small"
					>编辑</LTButton
				>
			</template>

			<LTButton
				v-for="item in getButtons"
				:disabled="handleDisabled(item.disabled)"
				:style="{
					color: handleDisabled(item.disabled) ? '#d9d9d9' : '#3370ff',
				}"
				type="text"
				size="small"
				:key="item.event"
				@click="handleButtonsItemClick(item.event)"
				>{{ item.text }}</LTButton
			>

			<LTDropdown
				:trigger="['hover']"
				v-if="menus.length > 0"
				@menu-event="handleMenuEvent"
				:dropMenuList="handleMenuDisabled(menus)"
			>
				<Button
					style="color: #3370ff"
					type="text"
					size="small"
					:icon="h(EllipsisOutlined)"
				></Button>
			</LTDropdown>
		</template>
	</div>
</template>

<script lang="ts" setup>
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { Button } from 'ant-design-vue';
import { computed, h } from 'vue';
import { isFunction, isUndefined } from 'lodash-es';
import { Fn } from '@lt-frame/utils';
import { DropMenu, LTDropdown } from '../../../dropdown';
import { LTButton } from '../../../button';
import { gridOperateColumProps } from './grid-operate-column';

const props = defineProps(gridOperateColumProps);

/** 判断是否是新增的数据，如果是新增的数据只显示删除按钮 */
const getIsInsert = computed(() => {
	const { row } = props.params;
	return row._X_ROW_INSERT;
});

function handleMenuEvent(menu: DropMenu) {
	const { operateColumConfig, params } = props;
	if (operateColumConfig) {
		const { onMenusItemClick } = operateColumConfig;
		if (isFunction(onMenusItemClick)) {
			onMenusItemClick(menu.event, params);
		}
	}
}

function handleButtonsItemClick(event?: string | number) {
	const { operateColumConfig, params } = props;
	if (operateColumConfig) {
		const { onButtonsItemClick } = operateColumConfig;
		if (isFunction(onButtonsItemClick)) {
			onButtonsItemClick(event, params);
		}
	}
}

function handleViewClick() {
	const { operateColumConfig, params } = props;
	if (operateColumConfig) {
		const { onViewClick } = operateColumConfig;
		if (isFunction(onViewClick)) {
			onViewClick(params);
		}
	}
}

const menus = computed(() => {
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { menus } = operateColumConfig;
		if (menus) {
			// 剔除不显示的菜单
			const vMenus = menus.filter((item) => {
				const { visible } = item;
				if (!isUndefined(visible)) {
					if (isFunction(visible)) {
						return visible(props.params.row);
					}
					return visible;
				}
				// 默认显示
				return true;
			});
			return vMenus;
		}
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
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { buttons } = operateColumConfig;
		if (buttons) {
			// 剔除不显示的按钮
			const mButtons = buttons.filter((item) => {
				const { visible } = item;
				if (!isUndefined(visible)) {
					if (isFunction(visible)) {
						return visible(props.params.row);
					}
					return visible;
				}
				// 默认显示
				return true;
			});
			return mButtons;
		}
	}
	return [];
});

function handleDisabled(disabled?: boolean | Fn<boolean>): boolean {
	if (isFunction(disabled)) {
		return disabled(props.params.row);
	}
	return disabled as boolean;
}

const getViewVisible = computed(() => {
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { viewVisible } = operateColumConfig;
		if (viewVisible) {
			if (isFunction(viewVisible)) {
				return viewVisible(props.params.row);
			}
			return viewVisible;
		}
	}
	return false;
});

const getViewDisabled = computed(() => {
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { viewDisabled } = operateColumConfig;
		if (viewDisabled) {
			if (isFunction(viewDisabled)) {
				return viewDisabled(props.params.row);
			}
			return viewDisabled;
		}
	}
	return false;
});

const getEditVisible = computed(() => {
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { editVisible } = operateColumConfig;
		if (editVisible) {
			if (isFunction(editVisible)) {
				return editVisible(props.params.row);
			}
			return editVisible;
		}
	}
	return false;
});

const getEditDisabled = computed(() => {
	const { operateColumConfig } = props;
	if (operateColumConfig) {
		const { editDisabled } = operateColumConfig;
		if (editDisabled) {
			if (isFunction(editDisabled)) {
				return editDisabled(props.params.row);
			}
			return editDisabled;
		}
	}
	return false;
});

/** 开启编辑 */
const editRowEvent = async () => {
	const { $grid, row } = props.params;
	if ($grid) {
		$grid.setEditRow(row);
	}
};

/** 是否是编辑状态 */
function isActiveStatus() {
	const { $grid, row } = props.params;
	if ($grid && row) {
		return $grid.isEditByRow(row);
	}
	return false;
}

/** 取消编辑并还原数据 */
async function cancelRowEvent() {
	const { $grid, row } = props.params;
	if ($grid) {
		await $grid.clearEdit();
		if (row._X_ROW_INSERT) {
			$grid.remove(row);
		} else {
			await $grid.revertData(row);
		}
	}
}
</script>
