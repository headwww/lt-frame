<template>
	<vxe-table
		v-bind="$attrs"
		stripe
		round
		:export-config="{}"
		:import-config="{}"
		ref="vxeTableRef"
		size="small"
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
						@click="saveRowEvent(row)"
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
import { tableProps } from './table';

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
const emit = defineEmits(['cancelRowEvent', 'editRowEvent', 'saveRowEvent']);

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
		emit('editRowEvent', row);
	}
};

/** 取消编辑并还原数据 */
async function cancelRowEvent(row: any) {
	const $table = vxeTableRef.value;
	if ($table) {
		await $table.clearEdit();
		await $table.revertData(row);
		emit('cancelRowEvent', row);
	}
}

/** 保存 */
const { createMessage, notification } = useMessage();
const saveRowEvent = async (row: any) => {
	const $table = vxeTableRef.value;
	if ($table) {
		loading.value = true;
		const saveResult = (isSave: boolean, description: any) => {
			const { clearEdit, reloadRow } = $table;
			if (isSave) {
				createMessage.success('保存成功');
				clearEdit();
				reloadRow(row, {});
			} else {
				notification.error({
					message: '保存失败',
					description,
					duration: 4,
				});
			}
			loading.value = false;
		};
		emit('saveRowEvent', row, saveResult);
	}
};
</script>
