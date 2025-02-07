import { VxeGridInstance, VxeGridProps, VxePagerProps } from 'vxe-table';
import { computed, getCurrentInstance, ref } from 'vue';
import { isUndefined } from 'xe-utils';

export function useTableId() {
	const instance = getCurrentInstance();

	if (isUndefined(instance?.type.name)) {
		throw new Error('请设置defineOptions的name值');
	}

	function tableId(suffix?: string) {
		return `${instance?.type.name}_${suffix || 'main'}`;
	}
	return {
		tableId,
	};
}

export function useTable(id?: string, opt?: VxeGridProps) {
	const { tableId } = useTableId();

	/**
	 * @deprecated 废弃，建议使用queryParams替代
	 */
	const sql = ref();

	const queryParams = ref<any>();

	const pager = ref<VxePagerProps>({
		currentPage: 1,
		pageSize: 100,
	});

	const grid = ref<VxeGridInstance>();
	const fields = ref<string[]>([]);
	const options = ref<VxeGridProps>({ ...opt });
	const treeOptions = ref<VxeGridProps>({
		treeConfig: {
			transform: true,
			rowField: '$id',
			parentField: '$parentId',
		},
		menuConfig: {
			body: {
				options: [[]],
			},
		},
		data: [],
	});

	const currentRecord = computed(() => grid.value?.getCurrentRecord());

	return {
		tableId: tableId(id),
		pager,
		grid,
		fields,
		options,
		treeOptions,
		currentRecord,
		sql,
		queryParams,
	};
}
