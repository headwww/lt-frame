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
				<NSettingsPane :items="items"></NSettingsPane>
				<Setter v-if="false" :state="a" :items="items"></Setter>

				<SettingsPane
					v-if="false"
					:config="gridSchema"
					@change="handleChange"
					@update:value="handle"
				></SettingsPane>
			</div>
		</div>
	</Modal>
</template>

<script lang="ts" setup>
import { useNamespace } from '@lt-frame/hooks';
import { Modal, Button } from 'ant-design-vue';
import { reactive, ref, watch } from 'vue';
import { VxeColumnProps, VxeGridInstance, VxeGridProps } from 'vxe-table';
import { isArray, isUndefined } from 'lodash-es';
import { LtHttp } from '@lt-frame/version-1';
import SettingsPane from './settings-pane.vue';
import { gridSchema, items } from './schema';
import { Column, TableFields } from './types';
import { LtTablePlugins } from '../..';
import { SettingsPane as Setter } from './settings-pane';
import { SettingsPane as NSettingsPane } from '../../../lowcode-engine';

const a = ref({ field1: '0000' });

watch(
	() => a.value,
	() => {
		console.log('====', a.value);
	},
	{
		deep: true,
	}
);

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

function handle(value: any) {
	Object.entries(value).forEach(([key, value]) => {
		handleChange({ key, value } as { key: keyof TableFields; value: any });
	});
}

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
	console.log(e);

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
					let editRender;

					if (item.type === 'text') {
						editRender = {
							name: LtTablePlugins.EditInput,
							props: {
								allowClear: true,
							},
						};
					} else if (item.type === 'data') {
						formatter = [LtTablePlugins.FormatterTime, item.dataFormatter];
						editRender = {
							name: LtTablePlugins.EditDatePicker,
						};
					} else if (item.type === 'number') {
						formatter = [
							LtTablePlugins.FormatterToFixedUnit,
							item.numberFormatter,
						];
						editRender = {
							name: LtTablePlugins.EditInputNumber,
						};
					} else if (item.type === 'enum') {
						formatter = [LtTablePlugins.FormatterEnum2, item.enumFormatter];
						const options = item.enumFormatter.map((item) => ({
							label: item.value,
							value: item.key,
						}));
						editRender = {
							name: LtTablePlugins.EditSelect,
							props: {
								options,
							},
						};
					} else {
						formatter = ({ cellValue }: any) => cellValue;

						const columns: VxeColumnProps[] = item.extraDataSources.columns.map(
							(item) => ({
								field: item.field,
								title: item.field,
								width: item.width,
							})
						);
						columns.push({ type: 'seq', width: 40, title: '#', fixed: 'left' });
						const queryPath = item.extraDataSources.columns.map(
							(item) => item.field
						);

						editRender = {
							name: LtTablePlugins.EditEntity,
							props: {
								configs: {
									columns,
								},
								ajax: () =>
									new Promise<any[]>((resolve, reject) => {
										LtHttp.post({
											url: item.extraDataSources.url,
											data: [
												{
													targetClass: item.extraDataSources.targetClass,
													queryPath,
												},
											],
										})
											.then((data) => {
												resolve(data);
											})
											.catch(() => {
												reject();
											});
									}),
							},
						};
					}

					gridProps.columns?.push({
						field: item.field,
						title: item.title,
						width: item.width,
						fixed: item.fixed,
						sortable: item.sortable,
						formatter,
						editRender,
					});
				});
			}
			gridProps.editConfig = { mode: 'row', trigger: 'dblclick' };
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
