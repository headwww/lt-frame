<template>
	<Modal
		v-model:open="open"
		width="100%"
		:closable="false"
		:wrap-class-name="ns.b()"
		:footer="null"
	>
		<div :class="ns.e('title')">
			<span class="font-size-15px font-500">表格配置</span>
			<div>
				<Button type="primary">保存</Button>
				<Button class="ml-12px">取消</Button>
			</div>
		</div>

		<div :class="ns.e('workbench-body')">
			<div :class="ns.e('workbench-body-center')">
				<div :class="ns.e('workbench-body-center-workspace')">
					<vxe-grid ref="xGrid" class="p-5px" v-bind="options"></vxe-grid>
				</div>
			</div>

			<div :class="[ns.e('workbench-body-setting'), 'overflow-auto']">
				<SettingsPane v-model:value="value" :items="schemas"></SettingsPane>
			</div>
		</div>
	</Modal>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Modal, Button } from 'ant-design-vue';
import { reactive, ref, watch } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';
import { SettingsPane } from '@lt-frame/components';
import { TableFields, schemas } from './config';
import { useSetterAdapter } from './use-setter-adapter';

const ns = useNamespace('table-designer');

const value = ref<TableFields>({});

const { options, buildTableOption } = useSetterAdapter();

watch(
	() => options.value,
	() => {
		console.log(options.value);
	},
	{
		deep: true,
	}
);

watch(
	() => value.value,
	() => {
		buildTableOption(value.value);
	},
	{
		deep: true,
	}
);

const xGrid = ref<VxeGridInstance>();

const gridProps = reactive<VxeGridProps>({
	stripe: true,
	align: 'center',
	data: [{}, {}, {}, {}, {}, {}, {}],
	showHeader: true,
	columns: [],
	columnConfig: {
		isCurrent: true,
	},
});

gridProps;

const open = ref<boolean>(true);
</script>
