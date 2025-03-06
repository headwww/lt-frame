<template>
	<LtPageLayout>
		<button
			@click="
				() => {
					console.log(xGrid);
				}
			"
		>
			测试
		</button>
		<LtSplitpanes class="default-theme">
			<LtPane size="18" min-size="18" max-size="36" class="p12">
				<template #default="{ height }">
					<LtDivider title="公司" />
					<LtTree
						search
						directoryTree
						:loading="treeLoading"
						:treeData="treeData"
						:height="height - 120"
						:style="{
							height: `${height - 120}px`,
						}"
						v-model:selectedKeys="selectedKeys"
					>
						<template #title="data">
							<div class="h40 lh-40">
								<Tooltip :title="data.title">
									{{ data.title }}
								</Tooltip>
							</div>
						</template>
					</LtTree>
					<LtButton @click="findCorps" class="w-full mt-35">刷新</LtButton>
				</template>
			</LtPane>
			<LtPane size="82" class="flex flex-col justify-start">
				<LtSplitpanes horizontal>
					<LtPane size="70">
						<LtDivider title="职员信息" />
						<LtConfigTable
							:tableInstance="xGrid"
							tUid="TestManager_sub"
							t-label="子表"
							entity="lt.app.productbasic.model.OrderClassesLine"
							v-model:config="gridOptions"
							v-model:listeners="gridEvents"
							:eventBus="eventBus"
							:datasource="datasource"
							v-model:pager="pager"
							@pageChange="onSql"
							@attach="onAttach"
							@sqlChange="
								(sql) => {
									console.log('sqlChange', sql);
								}
							"
							@queryChange="
								(queryParams) => {
									console.log('queryChange', queryParams.expression);
								}
							"
							v-model:queryParams="queryParams"
						>
							<template #table>
								<vxe-grid
									class="lt-table-scrollbar"
									ref="xGrid"
									v-bind="gridOptions"
									v-on="gridEvents"
								></vxe-grid>
							</template>
						</LtConfigTable>
					</LtPane>
					<LtPane size="30">
						<LtDivider title="职员信息" />
						<LtConfigTable
							tUid="TestManager_sub"
							t-label="子表"
							entity="lt.app.productbasic.model.OrderClassesLine"
							v-model:config="gridOptions"
							v-model:listeners="gridEvents"
							:eventBus="eventBus"
							:datasource="datasource"
							v-model:pager="pager"
							@pageChange="onSql"
							@attach="onAttach"
							@sqlChange="
								(sql) => {
									console.log('sqlChange', sql);
								}
							"
							@queryChange="
								(queryParams) => {
									console.log('queryChange', queryParams.expression);
								}
							"
							v-model:queryParams="queryParams"
						>
							<template #table>
								<vxe-grid
									class="lt-table-scrollbar"
									v-bind="gridOptions"
									v-on="gridEvents"
								></vxe-grid>
							</template>
						</LtConfigTable>
					</LtPane>
				</LtSplitpanes>
			</LtPane>
		</LtSplitpanes>

		<Drawer v-model:open="open" width="60%">
			<div class="flex flex-items-center mb-10">
				<span class="font-500 font-size-20px mr-10">
					{{ 'row' }}
				</span>
				<Tag color="purple">{{ 'tag' }}</Tag>
			</div>
			<span class="font-size-14px font-400 color-blueGray">{{ 'conent' }}</span>
			<div>
				<LtConfigTable
					:tUid="'ProductPlanManager_line'"
					entity="lt.app.product.model.ProductPlanLine"
					v-model:fields="lineFields"
					v-model:config="lineOptions"
					v-model:pager="linePager"
					tLabel="子工序生产计划单行"
				>
					<template #table>
						<vxe-grid
							ref="lineGrid"
							v-bind="lineOptions"
							class="lt-table-scrollbar"
							setCurrentRow
							scrollToRow
						>
						</vxe-grid>
					</template>
				</LtConfigTable>
			</div>
		</Drawer>
	</LtPageLayout>
</template>

<script setup lang="ts">
import { Drawer, Tag, Tooltip } from 'ant-design-vue';
import {
	LtPageLayout,
	LtSplitpanes,
	LtPane,
	LtDivider,
	LtTree,
	LtButton,
	TreeItem,
	LtDatasource,
} from '@lt-frame/components';
import { Condition } from '@lt-frame/utils';
import {
	LtConfigTable,
	LtHttp,
	PageResponse,
	showAttachment,
	TableQueryParams,
} from '@lt-frame/version-1';
import { onMounted, reactive, ref, watch } from 'vue';
import {
	VxeGridInstance,
	VxeGridListeners,
	VxeGridProps,
	VxePagerProps,
} from 'vxe-table';
import { useTable } from '.';

defineOptions({
	name: 'EquipmentKeepRecordManager',
});

const queryParams = ref<TableQueryParams>();

watch(
	() => queryParams.value,
	(value) => {
		console.log(value);
		console.log(value?.expression);
	}
);

watch(
	() => pager.value,
	(value) => {
		console.log(value);
	}
);

function onAttach(props: any) {
	console.log(props);
	showAttachment({
		...props,
		tableRef: xGrid.value,
		tableConfig: {
			entity: 'lt.fw.core.model.biz.Employee',
		},
	});
}

function onSql() {}
// LtDatasource.add('findUser', {
// 	createDatasource(fields: string[], params: any) {
// 		console.log(params);

// 		const c = new Condition();
// 		c.setTargetClass('lt.fw.core.model.biz.Dept');
// 		c.addQueryPath(...fields);
// 		// c.expr(expr!!);
// 		return new Promise((resolve, reject) => {
// 			LtHttp.post({
// 				url: 'api/deptServiceImpl/findDepts',
// 				data: [c],
// 			})
// 				.then((data) => {
// 					resolve(data);
// 				})
// 				.catch(() => {
// 					reject();
// 				});
// 		});
// 	},

// 	uniqueClasspath: 'lt.app.productbasic.model.OrderClasses',
// 	type: 'default',
// });

LtDatasource.add('查询班次（分页）', {
	createDatasource(fields: string[], params: any) {
		console.log(params, fields);

		const c = new Condition();
		c.setTargetClass('lt.app.productbasic.model.OrderClasses');
		c.addQueryPath(...fields);
		const query = fields
			.map((field) => `this.${field} LIKE '%${params.value}%'`)
			.join(' OR ');
		if (params.value) {
			c.expr(query);
		}
		return new Promise((resolve, reject) => {
			LtHttp.post({
				url: 'api/orderClassesService/findOrderClassessByPage',
				data: [params.pager, c],
			})
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					reject();
				});
		});
	},

	uniqueClasspath: 'lt.app.productbasic.model.OrderClasses',
	type: 'page',
});

LtDatasource.add('查询班次', {
	createDatasource(fields: string[], params: any) {
		console.log(params);

		const c = new Condition();
		c.setTargetClass('lt.app.productbasic.model.OrderClasses');
		c.addQueryPath(...fields);
		return new Promise((resolve, reject) => {
			LtHttp.post({
				url: 'api/orderClassesService/findOrderClassess',
				data: [c],
			})
				.then((data) => {
					resolve(data);
				})
				.catch(() => {
					reject();
				});
		});
	},

	uniqueClasspath: 'lt.app.productbasic.model.OrderClasses',
	type: 'default',
});
const treeLoading = ref(false);

const treeData = ref<TreeItem[]>([]);

const selectedKeys = ref<string[]>([]);

const xGrid = ref<VxeGridInstance>();

watch(
	() => xGrid.value?.getTableData(),
	(value) => {
		console.log('=====', value);
	}
);

const gridEvents = reactive<VxeGridListeners>({
	cellMenu({ row }) {
		const $grid = xGrid.value;
		if ($grid) {
			$grid.setCurrentRow(row);
		}
	},
});

const a = ref(true);
const datasource = {
	数据i: (row: any) => {
		console.log(row);

		return a.value;
	},
};

const eventBus = {
	test: () => {
		console.log(xGrid.value?.getRecordset());
	},
	atsta: (param: any) => {
		console.log(param, param.$table?.getCurrentRecord());
	},
};
const gridOptions = ref<VxeGridProps>({
	menuConfig: {
		body: {
			options: [[]],
		},
	},
	importConfig: {
		mode: 'insert',
	},
	exportConfig: {},
});

xGrid.value?.setColumnFixed;
onMounted(() => {
	findCorps();
});

function findCorps() {
	treeLoading.value = true;
	treeData.value = [];
	selectedKeys.value = [];
	find1<any>(new Condition())
		.then((resp) => {
			// 将请求到的数据处理成tree组件需要的方式
			treeData.value = resp.map(
				(item) =>
					({
						title: item.name,
						key: item.id,
						icon: 'octicon:organization-16',
						row: item,
					}) as TreeItem
			);
		})
		.finally(() => {
			treeLoading.value = false;
		});
}

function find1<T>(condition: Condition) {
	condition.setTargetClass('lt.fw.core.model.biz.Corp');
	return LtHttp.post<Array<T>>({
		url: 'api/corpService/findCorps',
		data: [condition],
	});
}

watch(
	() => selectedKeys.value,
	() => {
		const treeItem = treeData.value.find(
			(item) => selectedKeys.value[0] === item.key
		);
		finEmployee(treeItem);
	},
	{
		immediate: true,
	}
);

function finEmployee(treeItem?: TreeItem) {
	// 清空table的数据
	gridOptions.value.data = [];
	if (treeItem) {
		const condition = new Condition();
		condition.prop('corp.id', treeItem.row.id);
		condition.addQueryPath('dept.name');
		condition.addQueryPath('corp.name');
		gridOptions.value.loading = true;
		find2<any>(condition)
			.then((resp) => {
				gridOptions.value.data = resp;
			})
			.finally(() => {
				gridOptions.value.loading = false;
			});
	}
}

/**
 * 查询职员
 * zjj
 * @param condition
 * @returns
 */
function find2<T>(condition: Condition) {
	condition.expr(
		queryParams.value?.expression!,
		...(queryParams.value?.params || [])
	);
	condition.setTargetClass('lt.fw.core.model.biz.Employee');
	return LtHttp.post<Array<T>>({
		url: 'api/employeeService/findEmployees',
		data: [condition],
	});
}

const condition = new Condition();

const pager = ref<VxePagerProps>({});
condition.setTargetClass('lt.app.common.model.Area');
LtHttp.post<PageResponse<any>>({
	url: 'api/areaService/findAreasByPage',
	data: [
		{
			pageNo: 0,
			pageSize: 2,
			rowCountEnabled: true,
		},
		condition,
	],
}).then((data) => {
	pager.value.total = data.rowCount;
	pager.value.pageSize = 4;
});

const {
	options: lineOptions,
	fields: lineFields,
	grid: lineGrid,
	pager: linePager,
} = useTable('line', { height: 550 });

const open = ref(false);

onTest;
function onTest() {
	open.value = true;
	LtHttp.post<PageResponse<any>>({
		url: 'api/productPlanService/findLinesByPage',
		data: [
			{
				pageNo: 0,
				pageSize: 100,
				rowCountEnabled: true,
			},
			{
				targetClass: 'lt.app.product.model.ProductPlanLine',
				propertyParams: {
					'parent.id': '1051807672069787648',
				},
				queryPath: [
					'executeStatus',
					'goods.code',
					'mainQuantity',
					'goods.fullName',
					'goods.drawNumber',
					'workCenter.name',
					'goods.otherCode',
					'goods.executiveStandard',
					'goods.remarks',
					'startDate',
					'endDate',
					'needDate',
					'process.name',
					'position.name',
					'equipment.code',
					'releaseDate',
					'bom.code',
					'isLock',
					'pushedQuantity',
				],
			},
		],
	})
		.then((data) => {
			lineOptions.value.data = data.result;
			linePager.value.total = data.rowCount;
			console.log(data);
		})
		.finally(() => {
			lineOptions.value.loading = false;
		});
}

LtHttp.post<PageResponse<any>>({
	url: 'api/bomService/findTryBoms',
	data: [
		{
			bomType: {
				id: '592388920071689113',
				$$proxy$$: '',
			},
			checkDate: 1721593164263,
			checker: {
				name: '系统管理员',
				id: '1',
				version: 0,
				$$proxy$$: '',
			},
			code: 'BOM20240722000084',
			corp: {
				name: '通富超威公司',
				id: '541619370099484157',
				version: 1,
				$$proxy$$: '',
			},
			craftWork: {
				name: 'TMP:0,H',
				id: '667827211105001267',
				version: 1,
				$$proxy$$: '',
			},
			createDate: 1721593164263,
			created: 1721593175295,
			createdBy: '系统管理员',
			dept: {
				id: '1510655227',
				$$proxy$$: '',
			},
			factory: {
				id: '541619370099484158',
				$$proxy$$: '',
			},
			finishedRate: 1,
			goods: {
				name: 'T81721013310002200',
				id: '653318447211483136',
				version: 354,
				$$proxy$$: '',
			},
			id: '999893448712527873',
			isDefault: false,
			isInvalid: false,
			maker: {
				name: '系统管理员',
				id: '1',
				version: 0,
				$$proxy$$: '',
			},
			priority: 1,
			property: 'SCBOM',
			status: 'AUDITED',
			updated: 1736290901927,
			updatedBy: '系统管理员',
			version: 288,
			versionCode: 'T81721013310002200;H81A21013310014900;000000',
			versionDate: '2024-07-22',
			_X_ROW_KEY: 'row_976',
			$_checked: true,
		},
	],
})
	.then((data) => {
		console.log(data);
	})
	.finally(() => {
		lineOptions.value.loading = false;
	});
</script>

<style>
.s {
	display: flex;
	flex-direction: column;
	align-items: start;
	justify-content: start;
}
</style>
