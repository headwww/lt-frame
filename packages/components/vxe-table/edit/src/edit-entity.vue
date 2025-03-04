<template>
	<vxe-pulldown
		popup-class-name="lt-edit-entity-popup-class-name"
		className="lt-edit-entity-class-name"
		ref="pulldownRef"
		transfer
	>
		<template #default>
			<Input
				style="margin-top: 2px"
				:status="status"
				v-model:value="inputValue"
				@focus="focus"
				><template #suffix>
					<Tooltip title="清空选中的实例">
						<Button shape="circle" size="small" type="text" @click="clear">
							<DeleteOutlined style="color: #999" />
						</Button>
					</Tooltip>
				</template>
			</Input>
		</template>
		<template #dropdown>
			<div style="width: 500px">
				<vxe-grid
					class="lt-table-scrollbar"
					height="350"
					v-bind="getGridConfigs"
					v-on="gridEvents"
				></vxe-grid>
			</div>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { PropType, Ref, computed, reactive, ref, unref, watch } from 'vue';
import { Input, Tooltip, Button } from 'ant-design-vue';
import { VxePulldownInstance } from 'vxe-pc-ui';
import type {
	VxeGlobalRendererHandles,
	VxeGridInstance,
	VxeGridListeners,
	VxeGridProps,
} from 'vxe-table';
import { get, join, omit, set, split } from 'lodash-es';
import Fuse from 'Fuse.js';
import { Fn } from '@lt-frame/utils';
import { DeleteOutlined } from '@ant-design/icons-vue';

const pulldownRef = ref<VxePulldownInstance>();

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderTableEditParams>,
	configs: {
		type: Object as PropType<VxeGridProps>,
		default: () => ({}),
	},
	ajax: {
		type: Function as PropType<Fn<VxeGridInstance, Promise<any>>>,
	},
});

const getGridConfigs = reactive<VxeGridProps>(
	omit(props.configs, 'proxyConfig')
);
getGridConfigs.border = 'full';
getGridConfigs.stripe = true;

const status = ref<'' | 'error' | 'warning'>();

const filterRawData: Ref<Array<any>> = ref([]);

const inputValue = ref(get(props.params!!.row, props.params!!.column.field));

watch(
	() => props.params!!.row,
	() => {
		inputValue.value = get(props.params!!.row, props.params!!.column.field);
	},
	{
		deep: true,
	}
);

const clear = async () => {
	const { params } = props;
	if (params) {
		const splitList = split(params.column.field, '.');
		if (splitList.length > 1) {
			const firstKey = splitList[0];
			inputValue.value = '';
			set(params.row, firstKey, null);

			await params.$table.updateStatus(params);
			(params.$table as any)
				.validCellRules('change', params.row, params.column)
				.then(() => {
					status.value = '';
				})
				.catch(() => {
					status.value = 'error';
				});
		}
	}
	const $pulldown = pulldownRef.value;
	$pulldown?.hidePanel();
};

watch(inputValue, (newVal) => {
	if (newVal === '') {
		getGridConfigs.data = filterRawData.value;
	} else {
		getGridConfigs.data = unref(fuse)
			.search(newVal)
			.map((match: any) => match.item);
	}
});

const fuse = computed(() => {
	// 模糊查询的查找字段
	const keys = getGridConfigs.columns
		?.map((item: any) => item.field)
		.filter((item: any) => item !== undefined);

	return new Fuse(filterRawData.value, {
		keys: keys as any,
		threshold: 0.3,
	});
});

const focus = () => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		($table as any)
			.validCellRules('change', row, column)
			.then(() => {
				status.value = '';
			})
			.catch(() => {
				status.value = 'error';
			});
	}

	getGridConfigs.data = [];
	filterRawData.value = [];
	const { ajax } = props;
	if (ajax) {
		getGridConfigs.loading = true;
		ajax()
			.then((data: any) => {
				getGridConfigs.data = data;
				filterRawData.value = data;
			})
			.finally(() => {
				getGridConfigs.loading = false;
			});
	}
	const $pulldown = pulldownRef.value;
	$pulldown?.showPanel();
};

const gridEvents: VxeGridListeners<any> = {
	async currentChange({ row }) {
		const { params } = props;
		if (params) {
			const splitList = split(params.column.field, '.');
			if (splitList.length > 1) {
				const firstKey = splitList[0];
				splitList.shift();
				const otherKey = join(splitList, '.');
				inputValue.value = get(row, otherKey);
				set(params.row, firstKey, row);

				await params.$table.updateStatus(params);
				(params.$table as any)
					.validCellRules('change', params.row, params.column)
					.then(() => {
						status.value = '';
					})
					.catch(() => {
						status.value = 'error';
					});
			}
		}
		const $pulldown = pulldownRef.value;
		$pulldown?.hidePanel();
	},
};
</script>
