<template>
	<vxe-pulldown
		v-bind="getVxePulldownAttrs"
		style="width: 100%"
		ref="pulldownRef"
		transfer
	>
		<template #default>
			<Input
				:value="inputValue"
				v-bind="getInputAttrs"
				@update:value="handle"
				@focus="focusEvent"
				@blur="handleBlur"
			></Input>
		</template>
		<template #dropdown>
			<Table
				:data="tableData"
				:loading="loading"
				v-bind="getTableAttrs"
				@current-change="(item: any) => currentChangeEvent(item.row)"
			></Table>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { PropType, Ref, computed, ref, unref } from 'vue';
import { Input } from 'ant-design-vue';
import { VxeGlobalRendererHandles, VxePulldownInstance } from 'vxe-table';
import { isArray, isFunction, isNull, parseRef } from '@lt-frame/utils';
import {
	dropRight,
	get,
	isUndefined,
	join,
	omit,
	set,
	split,
	unset,
} from 'lodash-es';
import Fuse from 'Fuse.js';
import Table from '../../src/table.vue';

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
});

const tableData: Ref<Array<any>> = ref([]);
const searchData: Ref<Array<any>> = ref([]);

const inputValue = computed(() =>
	isNull(get(props.params?.row, `${props.params?.column.field!!}proxy`)) ||
	isUndefined(get(props.params?.row, `${props.params?.column.field!!}proxy`))
		? get(props.params?.row, props.params?.column.field!!)
		: get(props.params?.row, `${props.params?.column.field!!}proxy`)
);

const pulldownRef = ref<VxePulldownInstance>();

const loading = ref(false);

const focusEvent = () => {
	loading.value = true;
	tableData.value = [];
	searchData.value = [];

	if (isArray(props.params?.column.editRender.attrs!!.tableAttrs.data)) {
		tableData.value = props.params?.column.editRender.attrs!!.tableAttrs.data;
		searchData.value = props.params?.column.editRender.attrs!!.tableAttrs.data;
	}
	const data = props.params?.column.editRender.props?.data;
	if (data && isFunction(data)) {
		data()
			.then((data: any) => {
				tableData.value = parseRef(data);
				searchData.value = parseRef(data);
			})
			.finally(() => {
				loading.value = false;
			});
	} else {
		loading.value = false;
	}

	const $pulldown = pulldownRef.value;
	$pulldown?.showPanel();
};

const getVxePulldownAttrs = computed(
	() => props.params?.column.editRender.attrs!!.vxePulldownAttrs
);

const getInputAttrs = computed(
	() => props.params?.column.editRender.attrs!!.inputAttrs
);

const getTableAttrs = computed(() => {
	const obj = omit(
		{
			...props.params?.column.editRender.attrs!!.tableAttrs,
			editConfig: { showIcon: false },
			checkboxVisibility: false,
			isEditable: false,
		},
		'data'
	);
	return obj;
});

const handle = (value: any) => {
	if (value === '') {
		tableData.value = searchData.value;
	} else {
		tableData.value = unref(fuse)
			.search(value)
			.map((match: any) => match.item);
	}
	const { params } = props;
	if (params) {
		set(params.row, `${params.column.field}proxy`, value);
	}
};

const fuse = computed(() => {
	// 模糊查询的查找字段
	const keys = props.params?.column.editRender.attrs?.tableAttrs.colConfigs.map(
		(item: any) => item.field
	);
	return new Fuse(searchData.value, {
		keys: keys as any,
		threshold: 0.3,
	});
});

/**
 * 编辑框失去焦点时清除代理显示的数据
 *
 * @param scope
 * @param column
 */
function handleBlur() {
	const { params } = props;
	if (params) {
		unset(params.row, `${params.column.field}proxy`);
	}
}

/**
 * 选中
 * @param scope
 * @param column
 * @param row
 */
function currentChangeEvent(row: any) {
	const { params } = props;
	if (params) {
		const parts = split(params.column.field, '.');
		const modifiedParts = dropRight(parts);
		const modifiedString = join(modifiedParts, '.');
		// TODO: 先直接替换整个对象，后续想办法修改成指定的一些值
		set(params.row, modifiedString, row);
	}
	const $pulldown = pulldownRef.value;
	$pulldown?.hidePanel();
}
</script>
