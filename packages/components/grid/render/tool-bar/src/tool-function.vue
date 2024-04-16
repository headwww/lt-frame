<template>
	<div style="height: 40px; display: flex; align-items: center">
		<LtButton
			:disabled="isInsert"
			@click="insert"
			type="primary"
			preIcon="svg-icon:frame-insert"
		>
			新增
		</LtButton>
		<LtButton
			:disabled="isSave"
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
			:disabled="isRefresh"
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
			:disabled="isReset"
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
			:disabled="isRemove"
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
import { isFunction, last } from 'lodash-es';
import { computed } from 'vue';
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

/** 刷新 */
function refresh() {
	const { params } = props;
	if (params) {
		const { $grid } = params;
		if ($grid) {
			emit('refresh', params);
		}
	}
}

const isInsert = computed(() => {
	if (isFunction(props.insert)) {
		return props.insert(props.params!!);
	}
	return props.insert;
});

const isSave = computed(() => {
	if (isFunction(props.save)) {
		return props.save(props.params!!);
	}
	return props.save;
});

const isRemove = computed(() => {
	if (isFunction(props.remove)) {
		return props.remove(props.params!!);
	}
	return props.remove;
});

const isReset = computed(() => {
	if (isFunction(props.reset)) {
		return props.reset(props.params!!);
	}
	return props.reset;
});

const isRefresh = computed(() => {
	if (isFunction(props.refresh)) {
		return props.refresh(props.params!!);
	}
	return props.refresh;
});
</script>
