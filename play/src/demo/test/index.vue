<!--
 * @Description: 测试
 * @Author: sw
-->
<template>
	<LtPageLayout>
		<div class="box">
			<div ref="el" class="left">
				<vxe-grid ref="xGrid" v-bind="gridOptions"> </vxe-grid>
			</div>
			<div class="right">
				<LtCollapse header-class="header" title="数据列">
					<LtDraggable
						v-model="list"
						:animation="150"
						dragClass="bg"
						ghostClass="bg"
						handle=".handle"
						class="flex flex-col gap-2 p-4 rounded max-h-350px overflow-auto"
					>
						<div
							v-for="(item, index) in list"
							:key="item.field"
							class="h-35px min-h-35px rounded flex items-center justify-between px-4"
						>
							<Popover
								:overlayStyle="
									{
										height: '100%',
									} as CSSProperties
								"
								:overlayInnerStyle="
									{
										height: '100%',
									} as CSSProperties
								"
								:overlayClassName="'cus-popover'"
								trigger="click"
								placement="left"
							>
								<Button
									size="small"
									type="text"
									:icon="h(EditOutlined)"
								></Button>
								<template #content>
									<div style="width: 310px; height: 100%">
										<Button @click="gridOptions.stripe = false">1</Button>
									</div>
								</template>
							</Popover>
							<Input
								class="w-120px"
								size="small"
								@update:value="
									(value) => {
										handle(value, index);
									}
								"
								:value="item.title"
							></Input>
							<Select
								class="w-120px"
								size="small"
								:options="options"
								:value="item.editRender?.name"
								@change="
									(value) => {
										handleChange(value, index);
									}
								"
							>
							</Select>
							<Button
								size="small"
								type="text"
								:icon="h(DeleteOutlined)"
								@click="remove(index)"
							></Button>
							<Button
								size="small"
								type="text"
								class="handle cursor-move"
								:icon="h(HolderOutlined)"
							></Button>
						</div>
					</LtDraggable>
					<Button type="link" block @click="add"> 添加一项+ </Button>
				</LtCollapse>
				<LtCollapse header-class="header" title="操作列"></LtCollapse>
				<LtCollapse header-class="header" title="操作栏"></LtCollapse>
				<LtCollapse header-class="header" title="分页器"></LtCollapse>
				<LtCollapse header-class="header" title="高级">
					<div class="m-5px">
						<span>开启序号列</span>
						<Switch class="ml-5px" v-model:checked="checked" />
					</div>
				</LtCollapse>
				<LtCollapse header-class="header" title="全局样式"></LtCollapse>
			</div>
		</div>
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	HolderOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons-vue';
import {
	LtPageLayout,
	LtCollapse,
	LtDraggable,
	LtTablePlugins,
} from '@lt-frame/components';
import { useElementBounding } from '@vueuse/core';
import {
	Button,
	Input,
	Select,
	SelectProps,
	Switch,
	Popover,
} from 'ant-design-vue';
import { reactive, ref, h, watch, CSSProperties } from 'vue';
import { VxeColumnProps, VxeGridInstance, VxeGridProps } from 'vxe-table';

const el = ref(null);
const { right } = useElementBounding(el);
right;
const checked = ref<boolean>(false);

watch(
	() => checked.value,
	() => {
		if (checked.value) {
			gridOptions.columns?.unshift({
				type: 'seq',
				title: '#',
				width: 60,
				fixed: 'left',
			});
			console.log(gridOptions.columns);
		} else {
			gridOptions.columns = gridOptions.columns?.filter(
				(item) => item.type !== 'seq'
			);

			// xGrid.value?.loadColumn(gridOptions.columns!!);
		}
	}
);

const gridOptions = reactive<VxeGridProps>({
	editConfig: { trigger: 'click', mode: 'row' },
	data: [{}, {}, {}],
	columns: [],
});

const xGrid = ref<VxeGridInstance>();

const list = ref<VxeColumnProps[]>([
	{
		title: '名称',
		field: 'name',
		editRender: {
			name: LtTablePlugins.EditInput,
		},
	},
	{
		title: '编码',
		field: 'code',
		editRender: {
			name: LtTablePlugins.EditInputNumber,
		},
	},
	{
		title: '日期',
		field: 'data',
		editRender: {
			name: LtTablePlugins.EditDatePicker,
		},
	},
]);

const options = ref<SelectProps['options']>([
	{
		value: LtTablePlugins.EditInput,
		label: '文本',
	},
	{
		value: LtTablePlugins.EditInputNumber,
		label: '数字',
	},
	{
		value: LtTablePlugins.EditDatePicker,
		label: '日期',
	},
]);

const handleChange = (value: any, index: number) => {
	list.value[index].editRender = {};
	list.value[index].editRender!!.name = value;
};

gridOptions.border = 'full';

const handle = async (value: any, index: number) => {
	list.value[index].title = value;
};

function add() {
	list.value.push({});
}

watch(
	() => list.value,
	() => {
		gridOptions.columns = [];

		list.value.forEach((item) => {
			gridOptions.columns?.push({ ...item });
		});
		xGrid.value?.loadColumn(gridOptions.columns!!);
	},
	{ immediate: true, deep: true }
);

function remove(index: number) {
	list.value.splice(index, 1);
}
</script>
<style lang="scss">
.bg {
	background-color: #f1f2f3;
}

.my-dropdown3 {
	width: 400px;
	background-color: #fff;
	box-shadow: 0 0 6px 2px rgb(0 0 0 / 10%);
}

.box {
	display: flex;
	width: 100%;
	height: 100%;

	.left {
		width: 80%;
		border-right: solid 1px #eee;
	}

	.right {
		width: 20%;
	}

	.header {
		background-color: #f2f3f5;
		border-top: #eee 1px solid;
	}
}

.cus-popover {
	.ant-popover-content {
		height: 100%;

		.ant-popover-arrow {
			display: none;
		}
	}
}
</style>
