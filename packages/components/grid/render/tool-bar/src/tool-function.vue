<template>
	<div
		style="height: 40px; display: flex; align-items: center; margin-left: 10px"
	>
		<LTButton @click="insert" type="primary" preIcon="fluent:add-12-filled">
			新增
		</LTButton>
		<LTButton
			@click="save"
			style="margin-left: 8px; color: #7d8592"
			type="text"
			preIcon="svg-icon:frame-save"
		>
			保存
		</LTButton>
		<div
			style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
		></div>
		<LTButton
			style="color: #7d8592"
			type="text"
			@click="refresh"
			preIcon="svg-icon:frame-refresh"
		>
			刷新
		</LTButton>
		<div
			style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
		></div>
		<LTButton
			style="color: #7d8592"
			type="text"
			preIcon="svg-icon:frame-advanced-query"
		>
			高级查询
		</LTButton>

		<div
			style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
		></div>
		<LTButton
			style="color: #7d8592"
			type="text"
			@click="cleanFilter"
			preIcon="svg-icon:frame-clean"
		>
			清除筛选
		</LTButton>
		<div
			style="background: #979797; width: 1px; height: 14px; margin: 0 6px"
		></div>
		<LTButton
			@click="remove"
			style="color: #7d8592"
			type="text"
			preIcon="svg-icon:frame-delete"
		>
			删除
		</LTButton>
	</div>
</template>

<script lang="ts" setup>
import { useMessage } from '@lt-frame/hooks';
import { LTButton } from '../../../../button';
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
			$grid.insert({});
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
