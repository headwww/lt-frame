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
				<SettingsPane
					:config="gridSchema"
					@change="handleChange"
					:value="{
						columns: [],
					}"
				></SettingsPane>
			</div>
		</div>
	</Modal>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Modal, Button } from 'ant-design-vue';
import { reactive, ref } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';
import { isArray, isUndefined } from 'lodash-es';
import SettingsPane from './settings-pane.vue';
import { gridSchema } from './schema';
import { Column, TableFields } from './types';
import { LtTablePlugins } from '../..';

const ns = useNamespace('table-designer');

const xGrid = ref<VxeGridInstance>();

const gridProps = reactive<VxeGridProps>({
	stripe: true,
	align: 'center',
	data: [
		{
			id: 1,
			data: 1648190900467,
			enum: 'CORP',
		},
		{ id: 1.999999, data: 1648190900467, enum: 'DEPT' },
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		{},
	],
	showHeader: true,
	columns: [],
	columnConfig: {
		isCurrent: true,
	},
});

function handleChange(e: { key: keyof TableFields; value: any }) {
	if (e.key === 'stripe') {
		gridProps.stripe = e.value;
	}
	if (e.key === 'round') {
		gridProps.round = e.value;
	}
	if (e.key === 'border') {
		gridProps.border = e.value;
	}
	if (e.key === 'size') {
		gridProps.size = e.value;
	}
	if (e.key === 'align') {
		gridProps.align = e.value;
	}
	if (e.key === 'showOverflow') {
		if (e.value) {
			gridProps.showOverflow = 'tooltip';
		} else {
			gridProps.showOverflow = null;
		}
	}
	if (e.key === 'seqColunms') {
		if (e.value) {
			gridProps.columns?.push({
				type: 'seq',
				title: '#',
				width: 45,
				fixed: 'left',
			});
		} else {
			gridProps.columns?.forEach((element, index) => {
				if (element.type === 'seq') {
					gridProps.columns?.splice(index, 1);
				}
			});
		}
	}
	if (e.key === 'radioColunms') {
		if (e.value) {
			gridProps.columns?.push({
				type: 'radio',
				width: 50,
				title: '单选',
				fixed: 'left',
			});
		} else {
			gridProps.columns?.forEach((element, index) => {
				if (element.type === 'radio') {
					gridProps.columns?.splice(index, 1);
				}
			});
		}
	}
	if (e.key === 'checkboxColunms') {
		if (e.value) {
			gridProps.columns?.push({
				type: 'checkbox',
				width: 50,
				fixed: 'left',
			});
		} else {
			gridProps.columns?.forEach((element, index) => {
				if (element.type === 'checkbox') {
					gridProps.columns?.splice(index, 1);
				}
			});
		}
	}

	if (e.key === 'columns') {
		if (gridProps.columns) {
			const typeColumns: any[] = gridProps.columns.filter(
				(item) => !isUndefined(item.type)
			);
			gridProps.columns = [];
			gridProps.columns = [...typeColumns];
		}

		if (isArray(e.value)) {
			if (e.value.length === 0) {
				if (gridProps.columns) gridProps.columns.length = 0;
			} else {
				e.value.forEach((item: Column) => {
					let formatter;
					if (item.type === 'data') {
						formatter = [LtTablePlugins.FormatterTime, item.dataFormatter];
					} else if (item.type === 'number') {
						formatter = [
							LtTablePlugins.FormatterToFixedUnit,
							item.numberFormatter,
						];
					} else if (item.type === 'enum') {
						formatter = [LtTablePlugins.FormatterEnum2, item.enumFormatter];
					} else {
						formatter = ({ cellValue }: any) => cellValue;
					}

					gridProps.columns?.push({
						field: item.field,
						title: item.title,
						width: item.width,
						fixed: item.fixed,
						sortable: item.sortable,
						formatter,
					});
				});
			}
		} else {
			gridProps.columns!!.length = 0;
		}
	}
}

const open = ref<boolean>(true);
</script>
<style lang="scss">
.lt-table-designer {
	.ant-modal {
		max-width: 100%;
		top: 0;
		padding-bottom: 0;
		margin: 0;
	}

	.ant-modal-content {
		display: flex;
		flex-direction: column;
		height: calc(100vh);
		padding: 0;
		border-radius: 0;
		background-color: #edeff3;
	}

	.ant-modal-body {
		flex: 1;
	}

	&__title {
		display: flex;
		background-color: white;
		height: 48px;
		align-items: center;
		justify-content: space-between;
		padding-left: 18px;
		padding-right: 18px;
	}

	&__workbench-body {
		flex: 1;
		display: flex;
		min-height: 0;
		position: relative;
		height: calc(100vh - 48px);

		&-center {
			flex: 1;
			width: 100%;
			height: calc(100vh - 48px);
			position: relative;
			overflow: auto;
			box-sizing: border-box;

			&-workspace {
				background-color: white;
				box-sizing: border-box;
				width: auto;
				margin: auto;
				overflow: hidden;
				position: absolute;
				box-shadow: 0 2px 4px 0 rgb(31 56 88 / 6%);
				inset: 16px;
			}
		}

		&-setting {
			width: 400px;
			background-color: white;
			flex-shrink: 0;
			position: relative;
			margin-top: 2px;
		}
	}

	&__collapse {
		background-color: #f2f3f5;
		border-top: #eee 1px solid;
	}
}
</style>
