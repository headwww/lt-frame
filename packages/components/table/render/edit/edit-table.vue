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
				:enable-toolbar="false"
				style="width: 430px; height: 300px"
				:data="data"
				:loading="loading"
				v-bind="getTableAttrs"
				:col-configs="colConfigs"
				@current-change="(item: any) => currentChangeEvent(item.row)"
			></Table>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { Ref, computed, ref, unref } from 'vue';
import { Input } from 'ant-design-vue';
import { VxePulldownInstance } from 'vxe-table';
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
import { useAttrs } from '@lt-frame/hooks';
import Table from '../../src/table.vue';
import { editTableProps } from './edit-table';

defineOptions({
	name: 'LTEditTable',
	inheritAttrs: false,
});

const props = defineProps(editTableProps);
const attrs = useAttrs();

const data: Ref<Array<any>> = ref([]);
const searchData: Ref<Array<any>> = ref([]);

const inputValue = computed(() =>
	isNull(get(props.params?.row, `$proxy_${props.params?.column.field!!}`)) ||
	isUndefined(get(props.params?.row, `$proxy_${props.params?.column.field!!}`))
		? get(props.params?.row, props.params?.column.field!!)
		: get(props.params?.row, `$proxy_${props.params?.column.field!!}`)
);

const pulldownRef = ref<VxePulldownInstance>();

const loading = ref(false);

const focusEvent = () => {
	loading.value = true;
	data.value = [];
	searchData.value = [];

	const { tableDate, tableDatePromise } = props;

	if (tableDate && isArray(tableDate)) {
		data.value = tableDate;
		searchData.value = tableDate;
	}

	if (tableDatePromise && isFunction(tableDatePromise)) {
		tableDatePromise()
			.then((resp: any) => {
				data.value = parseRef(resp);
				searchData.value = parseRef(resp);
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

const getVxePulldownAttrs = computed(() => attrs.value.vxePulldownAttrs);

const getInputAttrs = computed(() => attrs.value.inputAttrs);

const getTableAttrs = computed(() => {
	const { tableAttrs } = attrs.value;
	if (tableAttrs) {
		return omit(tableAttrs, 'data', 'colConfigs');
	}
	return {};
});

const handle = (value: any) => {
	if (value === '') {
		data.value = searchData.value;
	} else {
		data.value = unref(fuse)
			.search(value)
			.map((match: any) => match.item);
	}
	const { params } = props;
	if (params) {
		set(params.row, `$proxy_${params.column.field}`, value);
	}
};

const fuse = computed(() => {
	// 模糊查询的查找字段
	const keys = props.colConfigs.map((item: any) => item.field);
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
		unset(params.row, `$proxy_${params.column.field}`);
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
./edit-table
