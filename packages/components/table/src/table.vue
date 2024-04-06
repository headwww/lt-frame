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
			<LtButton @click="insert" type="primary" preIcon="fluent:add-12-filled">
				新增
			</LtButton>
			<LtButton
				@click="save"
				style="margin-left: 8px; color: #7d8592"
				type="text"
				preIcon="svg-icon:frame-save"
			>
				保存
			</LtButton>
			<div
				style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
			></div>
			<LtButton
				style="color: #7d8592"
				type="text"
				preIcon="svg-icon:frame-advanced-query"
			>
				高级查询
			</LtButton>
			<div
				style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
			></div>
			<LtButton
				style="color: #7d8592"
				type="text"
				@click="cleanFilter"
				preIcon="svg-icon:frame-clean"
			>
				清除筛选
			</LtButton>
			<div
				style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
			></div>
			<LtButton
				@click="remove"
				style="color: #7d8592"
				type="text"
				preIcon="svg-icon:frame-delete"
			>
				删除
			</LtButton>
		</template>
	</vxe-toolbar>

	<vxe-table
		v-bind="$attrs"
		stripe
		:export-config="{}"
		:import-config="{}"
		ref="vxeTableRef"
		size="small"
		:class="thumb ? 'lt-table-scrollbar' : ''"
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
			width="55"
			title="操作"
			fixed="left"
			field="operate-edit"
		>
			<template #default="params">
				<template v-if="isActiveStatus(params.row)">
					<a-button
						@click="cancelRowEvent(params)"
						style="color: #6a6a6a"
						type="text"
						shape="circle"
						size="small"
						:icon="h(StopOutlined)"
					/>
				</template>
				<template v-else>
					<a-button
						@click="editRowEvent(params.row)"
						style="color: #6a6a6a"
						type="text"
						shape="circle"
						:icon="h(EditOutlined)"
					/>
				</template>
			</template>
		</vxe-column>

		<template v-for="column in colConfigs" :key="column.field">
			<vxe-column width="200" v-bind="column"> </vxe-column>
		</template>
	</vxe-table>
</template>

<script lang="ts" setup>
import { h, nextTick, ref, unref, useAttrs, watch } from 'vue';
import { StopOutlined, EditOutlined } from '@ant-design/icons-vue';
import { Button as AButton } from 'ant-design-vue';
import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table';
import { filter, get, map } from 'lodash-es';
import { useMessage } from '@lt-frame/hooks';
import { isNullOrUnDef } from '@lt-frame/utils';
import { tableProps } from './table';
import { LtButton } from '../../button';

defineOptions({
	name: 'LtTable',
	inheritAttrs: false,
});

const props = defineProps(tableProps);

const emit = defineEmits(['remove', 'save', 'refresh']);

const attrs = useAttrs();

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
async function cancelRowEvent(params: any) {
	const $table = vxeTableRef.value;
	if ($table) {
		await $table.clearEdit();
		if (params.row._X_ROW_INSERT) {
			$table.remove(params.row);
		} else {
			await $table.revertData(params.row);
		}
	}
}
/** 插入一条数据 */
function insert() {
	const $table = vxeTableRef.value;
	if ($table) {
		// 给数据添加一条插入的标签
		$table.insert({ _X_ROW_INSERT: true });
	}
}

const { createMessage } = useMessage();
const save = () => {
	const $table = vxeTableRef.value;
	const recordset = $table.getRecordset();

	const fieldsWithNotNullParams = filter(props.colConfigs, {
		params: { notNull: true },
	});
	const fieldArray = map(fieldsWithNotNullParams, 'field');

	const data = [...recordset.insertRecords, ...recordset.updateRecords];

	// 取出所有必填字段的值
	const mandatory: any[] = [];
	fieldArray.forEach((field) => {
		data.forEach((item) => {
			mandatory.push(get(item, field!!));
		});
	});

	let containsNullUndefinedOrEmptyString = false;
	for (let i = 0; i < mandatory.length; i += 1) {
		if (isNullOrUnDef(mandatory[i]) || mandatory[i] === '') {
			containsNullUndefinedOrEmptyString = true;
			break;
		}
	}

	if (containsNullUndefinedOrEmptyString) {
		createMessage.warning('有必填字段没有填写！');
		return;
	}

	if (data.length > 0) emit('save', data, $table.getRecordset());
};

/**
 * 删除
 */
function remove() {
	const $table = vxeTableRef.value;
	if ($table) {
		if ($table.getCheckboxRecords().length === 0) {
			return;
		}
		emit('remove', $table.getCheckboxRecords());
	}
}

/**
 * 更新表单
 */
const refresh = (): any => {
	emit('refresh');
};

/** 清除筛条件 */
const cleanFilter = () => {
	const $table = vxeTableRef.value;
	if ($table) {
		$table.clearFilter();
	}
};
</script>
