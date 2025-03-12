<template>
	<div>
		<vxe-button status="primary" @click="insertEvent">新增</vxe-button>

		<vxe-grid ref="gridRef" v-bind="gridOptions">
			<template #action="{ row }">
				<vxe-button mode="text" status="error" @click="removeRow(row)"
					>删除</vxe-button
				>
			</template>
		</vxe-grid>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { VxeGridInstance, VxeGridProps } from 'vxe-table';
import { VxeUI } from 'vxe-pc-ui';

interface RowVO {
	id: number;
	name: string;
	role: string;
	age: number;
	rate: number;
	num: number;
	address: string;
}

const gridRef = ref<VxeGridInstance<RowVO>>();

// 定义统计配置接口
interface StatConfig {
	field: string;
	label: string;
	methods?: {
		title: string;
		func: string;
	}[];
}
// 定义需要统计的字段配置
const statisticsFields: StatConfig[] = [
	{
		field: 'age',
		label: 'age',
		methods: [
			{
				title: '方差',
				func: `function mean(list, field) {
					let sum = 0;
					let mean = 0;
					// 计算平均值
					list.forEach(item => {
						sum += Number(item[field]);
					});
					mean = sum / list.length;
					
					// 计算方差
					let variance = 0;
					list.forEach(item => {
						variance += Math.pow(Number(item[field]) - mean, 2);
					});
					return (variance / list.length).toFixed(2);
				}`,
			},
		],
	},
	{
		field: 'rate',
		label: 'rate',
		methods: [
			{
				title: '平均值',
				func: `function mean(list, field) {
          let count = 0;
          list.forEach((item) => {
            count += Number(item[field]);
          });
          return (count / list.length).toFixed(1);
        }`,
			},
			{
				title: '合计',
				func: `function sum(list, field) {
          let count = 0;
          list.forEach((item) => {
            count += Number(item[field]);
          });
          return count.toFixed(1);
        }`,
			},
		],
	},
	{
		field: 'num',
		label: 'num',
		methods: [
			{
				title: '平均值',
				func: `function mean(list, field) {
          let count = 0;
          list.forEach((item) => {
            count += Number(item[field]);
          });
          return Math.round(count / list.length);
        }`,
			},
			{
				title: '合计',
				func: `function sum(list, field) {
          let count = 0;
          list.forEach((item) => {
            count += Number(item[field]);
          });
          return count;
        }`,
			},
		],
	},
];

// 创建统计对象的辅助函数
const createStatObjects = () => {
	const fields = statisticsFields.map((f) => f.field);
	const methodTypes = new Set<string>();

	// 收集所有可能的统计方法类型
	statisticsFields.forEach((field) => {
		field.methods?.forEach((method) => {
			methodTypes.add(method.title);
		});
	});

	// 为每种统计方法创建对应的响应式对象
	const statObjects: Record<string, any> = {};
	methodTypes.forEach((type) => {
		statObjects[type] = reactive({
			seq: type,
			...Object.fromEntries(fields.map((field) => [field, ''])),
		});
	});

	return statObjects;
};

// 执行统计脚本的函数
const executeScript = (script: string, list: any[], field: string) => {
	// 提取函数名和函数体
	const functionName = script.trim().match(/function\s+(\w+)/)?.[1];
	if (!functionName) {
		throw new Error('无法解析函数名');
	}

	// eslint-disable-next-line no-new-func
	const fn = new Function(
		'list',
		'field',
		`
		${script}
		return ${functionName}(list, field);
	`
	);
	return fn(list, field);
};

const statObjects = createStatObjects();

// 更新统计数据的函数
const updateFootCount = (list: RowVO[] = []) => {
	statisticsFields.forEach((config) => {
		if (config.methods) {
			config.methods.forEach((method) => {
				// 使用 method.title 直接从 statObjects 中获取对应的统计对象
				const targetObj = statObjects[method.title];
				if (targetObj) {
					targetObj[config.field] = executeScript(
						method.func,
						list,
						config.field
					);
				}
			});
		}
	});
};

const gridOptions = reactive<VxeGridProps<RowVO>>({
	border: true,
	showOverflow: true,
	showFooter: true,
	height: 400,
	editConfig: {
		trigger: 'click',
		mode: 'row',
	},
	columns: [
		{ field: 'seq', type: 'seq', width: 60 },
		{
			title: '统计信息',
			children: [
				{ field: 'name', title: 'Name', editRender: { name: 'VxeInput' } },
				{ field: 'age', title: 'Age', editRender: { name: 'VxeInput' } },
				{ field: 'num', title: 'Num', editRender: { name: 'VxeInput' } },
				{ field: 'rate', title: 'Rate' },
			],
		},
		{ title: '操作', width: 100, slots: { default: 'action' } },
	],

	footerData: Object.values(statObjects),
});

console.log(Object.values(statObjects));

setTimeout(() => {
	gridOptions.data = [
		{
			id: 10001,
			name: 'Test1',
			role: 'Develop',
			age: 10,
			num: 28,
			rate: 5,
			address: 'test abc',
		},
		{
			id: 10002,
			name: 'Test2',
			role: 'Test',
			age: 34,
			num: 22,
			rate: 4,
			address: 'Guangzhou',
		},
		{
			id: 10003,
			name: 'Test3',
			role: 'PM',
			age: 56,
			num: 32,
			rate: 3,
			address: 'Shanghai',
		},
		{
			id: 10004,
			name: 'Test4',
			role: 'Designer',
			age: 45,
			num: 24,
			rate: 1,
			address: 'Shanghai',
		},
		{
			id: 10005,
			name: 'Test5',
			role: 'PM',
			age: 56,
			num: 32,
			rate: 4,
			address: 'Shanghai',
		},
		{
			id: 10006,
			name: 'Test6',
			role: 'Designer',
			age: 45,
			num: 24,
			rate: 1,
			address: 'Shanghai',
		},
	];
}, 3000);

const insertEvent = async () => {
	const record = {
		name: 'New name',
	};
	const $grid = gridRef.value;
	if ($grid) {
		const { row: newRow } = await $grid.insert(record);
		$grid.setEditCell(newRow, 'age');
	}
};

const removeRow = async (row: RowVO) => {
	const $grid = gridRef.value;
	if ($grid) {
		const type = await VxeUI.modal.confirm('您确定要删除该数据?');
		if (type === 'confirm') {
			await $grid.remove(row);
			updateFootCount();
		}
	}
};

watch(
	() => gridOptions.data,
	(newVal) => {
		updateFootCount(newVal);
	},
	{
		deep: true,
	}
);
</script>
