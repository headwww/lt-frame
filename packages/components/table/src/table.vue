<template>
	<vxe-toolbar
		ref="toolbarRef"
		style="padding: 8px 12px"
		import
		export
		custom
		print
		:refresh="{ query: refresh }"
		v-if="enableToolbar"
	>
		<template #buttons>
			<LTButton @click="insert" type="primary" preIcon="fluent:add-12-filled">
				新增
			</LTButton>
			<LTButton
				@click="removeRowsEvent"
				style="margin-left: 8px"
				color="error"
				preIcon="fluent:delete-12-regular"
			>
				删除
			</LTButton>
		</template>
	</vxe-toolbar>

	<vxe-table
		v-bind="$attrs"
		stripe
		round
		:export-config="{}"
		:import-config="{}"
		ref="vxeTableRef"
		size="small"
		:scroll-y="{ enabled: true }"
		:loading="loading"
		show-overflow
		keep-source
		max-height="100%"
		:checkbox-config="{
			checkField: 'checked',
			trigger: 'cell',
			highlight: true,
			range: true,
		}"
		:edit-config="{ trigger: 'manual', mode: 'row', showStatus: true }"
		:column-config="{ resizable: true }"
		:row-config="{ isCurrent: true, isHover: true }"
	>
		<vxe-column
			v-if="checkboxVisibility"
			align="center"
			fixed="left"
			type="checkbox"
			width="40"
		></vxe-column>
		<vxe-column
			v-if="seqVisibility"
			align="center"
			type="seq"
			title=""
			width="40"
			fixed="left"
		></vxe-column>

		<vxe-column
			v-if="isEditable"
			align="center"
			min-width="50"
			width="70"
			title="操作"
			fixed="left"
			field="operate-edit"
		>
			<template #default="{ row }">
				<template v-if="isActiveStatus(row)">
					<a-button
						@click="cancelRowEvent(row)"
						style="font-size: 12px; color: #6a6a6a"
						type="text"
						shape="circle"
						size="small"
						:icon="h(StopOutlined)"
					/>
					<a-button
						@click="save(row)"
						style="font-size: 12px; color: #6a6a6a"
						type="text"
						size="small"
						shape="circle"
						:icon="h(SaveOutlined)"
					/>
				</template>
				<template v-else>
					<a-button
						@click="editRowEvent(row)"
						style="color: #6a6a6a"
						type="text"
						shape="circle"
						:icon="h(EditOutlined)"
					/>
				</template>
			</template>
		</vxe-column>

		<template v-for="column in colConfigs" :key="column.field">
			<vxe-column v-bind="column"> </vxe-column>
		</template>
	</vxe-table>
</template>

<script lang="ts" setup>
import { h, nextTick, ref, unref, useAttrs, watch } from 'vue';
import {
	StopOutlined,
	SaveOutlined,
	EditOutlined,
} from '@ant-design/icons-vue';
import { Button as AButton } from 'ant-design-vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';
import { useMessage } from '@lt-frame/hooks';
import { omit } from 'lodash-es';
import { tableProps } from './table';
import { LTButton } from '../../button';

defineOptions({
	name: 'LTTable',
	inheritAttrs: false,
});

const vxeTableRef = ref({} as VxeTableInstance);
const toolbarRef = ref<VxeToolbarInstance>();

nextTick(() => {
	// 将表格和工具栏进行关联
	const $table = vxeTableRef.value;
	const $toolbar = toolbarRef.value;
	if ($table && $toolbar) {
		$table.connect($toolbar);
	}
});

const emit = defineEmits(['insert', 'remove', 'update', 'refresh']);

const attrs = useAttrs();

defineProps(tableProps);

/** 以下设置让loading内外部都可以设置 */
const loading = ref<boolean>(unref(attrs).loading as boolean);
watch(
	() => unref(attrs).loading,
	() => {
		loading.value = unref(attrs).loading as boolean;
	}
);

function isActiveStatus(row: any) {
	const $table = vxeTableRef.value;
	return $table.isEditByRow(row);
}

/** 开启编辑 */
const editRowEvent = async (row: any) => {
	const $table = vxeTableRef.value;
	if ($table) {
		$table.setEditRow(row);
	}
};

/** 取消编辑并还原数据 */
async function cancelRowEvent(row: any) {
	const $table = vxeTableRef.value;
	if ($table) {
		await $table.clearEdit();
		await $table.revertData(row);
	}
}
/** 插入一条数据 */
function insert() {
	const $table = vxeTableRef.value;
	if ($table) {
		$table.insert({
			_X_ROW_INSERT: true,
		});
	}
}

function save(row: any) {
	if (row._X_ROW_INSERT) {
		const newRow = omit(row, '_X_ROW_INSERT');
		updateOrInsertRowEvent('insert', newRow);
	} else {
		updateOrInsertRowEvent('update', row);
	}
}

const { createMessage, notification } = useMessage();
/**
 * 新增还是修改
 */
const updateOrInsertRowEvent = async (type: 'insert' | 'update', row: any) => {
	const $table = vxeTableRef.value;
	if ($table) {
		loading.value = true;
		const saveResult = (isSave: boolean, description: any) => {
			const { clearEdit, reloadRow } = $table;
			if (isSave) {
				createMessage.success('保存成功');
				clearEdit();
				// 修改的话需要执行这步操作
				if (type === 'update') {
					reloadRow(row, {});
				}
			} else {
				notification.error({
					message: '保存失败',
					description,
					duration: 4,
				});
			}
			loading.value = false;
		};
		emit(type, row, saveResult);
	}
};

/**
 * 删除
 */
function removeRowsEvent() {
	const $table = vxeTableRef.value;
	if ($table) {
		if ($table.getCheckboxRecords().length === 0) {
			return;
		}
		loading.value = true;
		const removeResult = (isSave: boolean, description: any) => {
			if (isSave) {
				createMessage.success('删除成功');
			} else {
				notification.error({
					message: '删除失败',
					description,
					duration: 4,
				});
			}
			loading.value = false;
		};
		emit('remove', $table.getCheckboxRecords(), removeResult);
	}
}

/**
 * 更新表单
 */
const refresh = (): any => {
	emit('refresh');
};
</script>
