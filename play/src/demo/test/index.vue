<template>
	<div>
		<vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents"></vxe-grid>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { VxeGridInstance, VxeGridProps, VxeGridListeners } from 'vxe-table';

interface RowVO {
	id: number;
	name: string;
	nickname: string;
	role: string;
	sex: string;
	age: number;
	address: string;
}

const xGrid = ref<VxeGridInstance<RowVO>>();

const sumNum = (list: any[], field: string) => {
	let count = 0;
	list.forEach((item) => {
		count += Number(item[field]);
	});
	return count;
};

const gridOptions = ref<VxeGridProps<RowVO>>({
	border: true,
	showFooter: true,
	rowConfig: {
		isCurrent: true,
	},
	columnConfig: {
		resizable: true,
	},
	columns: [
		{ type: 'checkbox', width: 50 },
		{ type: 'seq', width: 60 },
		{ field: 'name', title: 'Name' },
		{ field: 'nickname', title: 'Nickname' },
		{ field: 'age', title: 'Age' },
		{ field: 'role', title: 'Role' },
		{ field: 'address', title: 'Address', showOverflow: true },
	],
	data: [
		{
			id: 10001,
			name: 'Test1',
			nickname: 'T1',
			role: 'Develop',
			sex: 'Man',
			age: 28,
			address: 'Shenzhen',
		},
		{
			id: 10002,
			name: 'Test2',
			nickname: 'T2',
			role: 'Test',
			sex: 'Women',
			age: 22,
			address: 'Guangzhou',
		},
		{
			id: 10003,
			name: 'Test3',
			nickname: 'T3',
			role: 'PM',
			sex: 'Man',
			age: 32,
			address: 'Shanghai',
		},
		{
			id: 10004,
			name: 'Test4',
			nickname: 'T4',
			role: 'Designer',
			sex: 'Women',
			age: 23,
			address: 'Shenzhen',
		},
		{
			id: 10005,
			name: 'Test5',
			nickname: 'T5',
			role: 'Develop',
			sex: 'Women',
			age: 30,
			address: 'Shanghai',
		},
	],

	footerMethod({ columns, data }) {
		return [
			columns.map((column, columnIndex) => {
				if (columnIndex === 0) {
					return '和值';
				}
				if (['age'].includes(column.field)) {
					return sumNum(data, column.field);
				}
				return '-';
			}),
		];
	},
});

gridOptions.value.menuConfig = {
	body: {
		options: [
			[
				{
					code: 'copy',
					name: '复制内容',
					prefixIcon: 'vxe-icon-copy',
					visible: true,
					disabled: false,
				},
				{ code: 'clear', name: '清除内容', visible: true, disabled: false },
				{ code: 'reload', name: '刷新表格', visible: true, disabled: false },
			],
		],
	},
};

const gridEvents = reactive<VxeGridListeners<RowVO>>({
	cellMenu({ row }) {
		const $grid = xGrid.value;
		if ($grid) {
			$grid.setCurrentRow(row);
		}
	},
	menuClick({ menu, row, column }) {
		const $grid = xGrid.value;
		if ($grid) {
			switch (menu.code) {
				case 'myPrint':
					$grid.print();
					break;
				case 'myExport':
					$grid.exportData();
					break;
			}
		}
		if ($grid) {
			switch (menu.code) {
				case 'copy':
					break;
				case 'clear':
					$grid.clearData(row, column.field);
					break;
			}
		}
	},
});
</script>
