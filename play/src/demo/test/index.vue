<template>
	<div>
		<button @click="fu">11</button>
		<div>
			<vxe-grid ref="xGrid" v-bind="options"> </vxe-grid>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';

const xGrid = ref<VxeGridInstance>();

const options = ref<VxeGridProps>({
	border: true,
	rowConfig: {
		isHover: true,
	},
	columns: [
		{
			field: 'id',
			treeNode: true,
		},
	],
});

const fu = () => {};
interface RowVO {
	id: number;
	name: string;
	role: string;
	sex: string;
	pId: number;
}

const mockList: RowVO[] = [];

setTimeout(() => {
	// 模拟数据
	for (let index = 0; index < 500; index++) {
		mockList.push({
			id: index,
			pId: 1000 % index,
			name: `Test${index}`,
			role: 'Developer',
			sex: '男',
		});
	}
	options.value.data = mockList;
	options.value.autoResize = true;
	options.value.height = 'auto';
}, 100);
</script>
