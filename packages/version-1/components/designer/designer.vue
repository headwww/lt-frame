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
					<vxe-grid ref="xGrid" class="p-5px" v-bind="gridProps"></vxe-grid>
				</div>
			</div>

			<div :class="[ns.e('workbench-body-setting'), 'overflow-auto']">
				<SettingsPane :items="schemas"></SettingsPane>
			</div>
		</div>
	</Modal>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Modal, Button } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';
import { SettingsPane } from '@lt-frame/components';
import { schemas } from './config';

const ns = useNamespace('table-designer');

const xGrid = ref<VxeGridInstance>();

const gridProps = reactive<VxeGridProps>({
	stripe: true,
	align: 'center',
	data: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
	showHeader: true,
	columns: [],
	columnConfig: {
		isCurrent: true,
	},
});

const open = ref<boolean>(true);
</script>
