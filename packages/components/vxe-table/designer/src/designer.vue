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
					:config="TableSchema"
					@change="handleChange"
					:value="gridProps"
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
import { isArray } from 'lodash-es';
import SettingsPane from './settings-pane.vue';
import { TableSchema } from './schema';

const ns = useNamespace('table-designer');

const xGrid = ref<VxeGridInstance>();

const gridProps = reactive<VxeGridProps>({
	stripe: true,
	align: 'center',
	data: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
	showHeader: true,
	columns: [
		{ title: '列1', field: 'L1', visible: true },
		{ title: '列2', field: 'L2' },
	],
	columnConfig: {
		isCurrent: true,
	},
});

type GridPropsKey = keyof VxeGridProps;

function handleChange(e: { key: GridPropsKey; value: any }) {
	const { key, value } = e;
	console.log(e);

	if (isArray(value)) {
		// 更新 columns 数组，触发响应式更新
		gridProps[key] = [...value];
	} else {
		// 处理其他属性的更新
		gridProps[key] = value;
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
