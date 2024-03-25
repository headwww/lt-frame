<template>
	<vxe-pulldown style="width: 100%" ref="pulldownRef" transfer>
		<template #default>
			<Input :status="status" v-model:value="inputValue" @focus="focus"></Input>
		</template>
		<template #dropdown>
			<div style="width: 100%; min-width: 430px; height: 300px">
				<LTGrid :grid-configs="getGridConfigs" v-on="gridEvents"></LTGrid>
			</div>
		</template>
	</vxe-pulldown>
</template>

<script lang="ts" setup>
import { PropType, Ref, computed, reactive, ref, unref, watch } from 'vue';
import { Input } from 'ant-design-vue';
import { VxePulldownInstance } from 'vxe-table';
import type { VxeGlobalRendererHandles, VxeGridListeners } from 'vxe-table';
import { get, join, omit, set, split } from 'lodash-es';
import Fuse from 'Fuse.js';
import LTGrid from '../../../src/grid.vue';
import { LTGridProps } from '../../../src/grid';

const pulldownRef = ref<VxePulldownInstance>();

const props = defineProps({
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
	gridConfigs: {
		type: Object as PropType<LTGridProps>,
		default: () => ({}),
	},
});

const getGridConfigs = reactive<LTGridProps>(
	omit(props.gridConfigs, 'proxyConfig')
);

const status = ref<'' | 'error' | 'warning'>();

const filterRawData: Ref<Array<any>> = ref([]);

const inputValue = ref(get(props.params!!.row, props.params!!.column.field));

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
	const keys = getGridConfigs.columns?.map((item: any) => item.field);
	return new Fuse(filterRawData.value, {
		keys: keys as any,
		threshold: 0.3,
	});
});

const focus = () => {
	const { params } = props;
	if (params) {
		const { $table, row, column } = params;
		$table
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
	// 实体编辑目前是内部把代理配置拿出来自己操作，后续有好的想法再更新
	const { proxyConfig } = props.gridConfigs;
	if (proxyConfig) {
		const { dataSource } = proxyConfig;
		if (dataSource) {
			getGridConfigs.loading = true;
			dataSource()
				.then((data: any) => {
					getGridConfigs.data = data;
					filterRawData.value = data;
				})
				.finally(() => {
					getGridConfigs.loading = false;
				});
		}
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
				params.$table
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
