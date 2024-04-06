<template>
	<div
		style="height: 40px; display: flex; align-items: center; margin-left: 10px"
	>
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
			@click="refresh"
			preIcon="svg-icon:frame-refresh"
		>
			刷新
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
	</div>
</template>

<script lang="ts" setup>
import { useMessage } from '@lt-frame/hooks';
import { last } from 'lodash-es';
import { LtButton } from '../../../../button';
import { toolFunctionProps } from './tool-function';

const props = defineProps(toolFunctionProps);

const emit = defineEmits(['remove', 'save', 'refresh']);

const { createMessage } = useMessage();
/** 插入一条数据 */
function insert() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			$grid.insert({ _X_ROW_INSERT: true });
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
		const { $grid } = params;
		if ($grid) {
			if ($grid.getCheckboxRecords().length === 0) {
				return;
			}
			emit('remove', $grid.getCheckboxRecords());
		}
	}
}

function refresh() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			emit('refresh', params);
		}
	}
}
</script>
