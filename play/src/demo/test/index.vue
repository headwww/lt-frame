<template>
	<div>
		<vxe-grid ref="gridRef" v-bind="gridOptions">
			<template #footer_seq="{ row }">
				<span style="color: blue">{{ row.seq }}</span>
			</template>

			<template #footer_num="{ row }">
				<span style="color: red">￥{{ row.num }}元</span>
			</template>
		</vxe-grid>
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { VxeGridInstance, VxeGridProps } from 'vxe-table';

const gridRef = ref<VxeGridInstance>();
interface RowVO {
	id: string;
	name: string;
	role: string;
	sex: string;
	num: string;
	address: string;
}

const footerData = [
	{ seq: '合计', num: '282' },
	{ seq: '平均', num: '2.88' },
	{ seq: '方差', num: '18' },
];

watch(
	() => gridOptions.value.data,
	() => {
		gridOptions.value.footerData = [
			{ seq: '合计', num: '2821' },
			{ seq: '平均', num: '21.88' },
			{ seq: '方差', num: '181' },
			{ seq: '方差2', num: '222181' },
		];
		console.log(gridOptions.value.footerData);
	},
	{
		deep: true,
	}
);

setTimeout(() => {
	gridOptions.value.data.push({
		id: '10009',
		name: 'Test9',
		role: 'Develop',
		sex: 'Man',
		num: '42',
		address: 'Guangzhou',
	});
	// gridRef.value?.updateFooter();
}, 2000);

const gridOptions = ref<VxeGridProps<RowVO>>({
	border: true,
	showFooter: true,
	height: 300,
	editConfig: {
		trigger: 'click',
		mode: 'row',
	},
	columns: [
		{ field: 'seq', type: 'seq', width: 70, slots: { footer: 'footer_seq' } },
		{ field: 'name', title: 'Name' },
		{ field: 'role', title: 'Role' },
		{ field: 'sex', title: 'Sex' },
		{
			field: 'num',
			title: 'Num',
			slots: { footer: 'footer_num' },
			editRender: { name: 'VxeInput' },
		},
		{ field: 'address', title: 'Address', showOverflow: true },
	],
	data: [
		{
			id: '10001',
			name: 'Test1',
			role: 'Develop',
			sex: 'Man',
			num: '28',
			address: 'test abc',
		},
		{
			id: '10002',
			name: 'Test2',
			role: 'Test',
			sex: 'Women',
			num: '22',
			address: 'Guangzhou',
		},
		{
			id: '10003',
			name: 'Test3',
			role: 'PM',
			sex: 'Man',
			num: '32',
			address: 'Shanghai',
		},
		{
			id: '10004',
			name: 'Test4',
			role: 'Designer',
			sex: 'Women',
			num: '24',
			address: 'Shanghai',
		},
		{
			id: '10005',
			name: 'Test5',
			role: 'Develop',
			sex: 'Man',
			num: '42',
			address: 'Guangzhou',
		},
		{
			id: '10006',
			name: 'Test6',
			role: 'Test',
			sex: 'Women',
			num: '39',
			address: 'Shanghai',
		},
		{
			id: '10007',
			name: 'Test7',
			role: 'Develop',
			sex: 'Man',
			num: '46',
			address: 'Shanghai',
		},
		{
			id: '10008',
			name: 'Test8',
			role: 'PM',
			sex: 'Women',
			num: '49',
			address: 'Guangzhou',
		},
	],
	footerData,
});
</script>
