<!--
 * @Description: 页面按钮权限分配
 * @Author: sw
-->
<template>
	<LtPageLayout>
		<LtSplitpanes class="default-theme">
			<LtPane size="20" :min-size="20" max-size="36" style="padding: 8px">
				<template #default="{ height }">
					<LtDivider title="角色列表" />
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
							<div style="height: 40px; line-height: 40px">
								<Tooltip :title="`${data.row.name}`">
									{{ data.row.name }}
								</Tooltip>
							</div>
						</template>
					</LtTree>
					<Button style="width: 100%; margin-top: 35px" @click="findTreeData">
						刷新
					</Button>
				</template>
			</LtPane>
			<LtPane>
				<LtDivider
					style="margin: 8px 0"
					title="设置角色可以管理的权限范围，设置功能页面访问权限，设置按钮的操作权限，字段的显示权限"
				>
				</LtDivider>

				<div style="height: calc(100% - 50px); padding: 30px">
					<PC>
						<template #left>
							<div
								style="
									width: 260px;
									margin-top: 20px;
									display: flex;
									align-items: center;
								"
							>
								<Input
									:size="'large'"
									:prefix="h(SearchOutlined)"
									style="background-color: rgb(0 0 0 / 6%); width: 200px"
									:bordered="false"
									placeholder="搜索菜单"
									v-model:value="searchValue"
								/>
								<Tooltip title="折叠/展开">
									<Button
										@click="onExpanded"
										type="text"
										style="margin-left: 12px"
										:icon="h(AlignLeftOutlined)"
									>
									</Button>
								</Tooltip>
								<Tooltip title="保存">
									<Button
										:loading="saveMenuLoading"
										:disabled="selectedKeys.length === 0"
										type="text"
										:icon="h(CheckOutlined)"
										@click="onSaveMenu"
									>
									</Button>
								</Tooltip>
							</div>
							<div style="width: 100%; overflow: auto; padding-top: 12px">
								<Tree
									root-class-name="tree-transparent"
									blockNode
									checkable
									v-model:expanded-keys="expandedKeys"
									v-model:selected-keys="menuSelectedKeys"
									v-model:checked-keys="menuCheckKeys"
									:tree-data="menuData"
								>
									<template #switcherIcon="{ switcherCls }">
										<div style="height: 35px; line-height: 35px">
											<CaretDownOutlined :class="switcherCls" />
										</div>
									</template>

									<template #title="{ title }">
										<div style="height: 35px; line-height: 35px">
											<span v-if="title.indexOf(searchValue) > -1">
												{{ title.substring(0, title.indexOf(searchValue)) }}
												<span style="color: #f50">{{ searchValue }}</span>
												{{
													title.substring(
														title.indexOf(searchValue) + searchValue.length
													)
												}}
											</span>
											<span v-else>{{ title }}</span>
										</div>
									</template>
								</Tree>
							</div>
						</template>
						<template #right="{ height }">
							<LtDivider title="功能权限">
								<template #extra>
									<Button
										:disabled="!(configTables.length > 0)"
										style="margin-right: 12px"
										type="primary"
										@click="onSavePermission"
										:loading="savePermission"
										>保存</Button
									>
								</template>
							</LtDivider>
							<Tabs v-if="configTables.length > 0" style="padding-right: 12px">
								<TabPane
									v-for="table in configTables"
									:key="table.key"
									:tab="table.title"
									style="overflow: auto"
									:style="{
										height: `${height - 85}px`,
									}"
								>
									<AccessControlGroup
										style="margin-bottom: 12px"
										v-for="item in table.items"
										:key="item.title"
										:title="item.title"
										:data="item.data"
										v-model:checked-keys="item.checks"
										v-model:unchecked-keys="item.unchecked"
									>
									</AccessControlGroup>
								</TabPane>
							</Tabs>

							<div
								v-else
								style="
									height: 100%;
									width: 100%;
									display: flex;
									margin-top: 80px;
								"
							>
								<Timeline style="margin: 0 auto">
									<TypographyTitle :level="4" style="margin-bottom: 20px"
										>操作步骤</TypographyTitle
									>

									<TimelineItem :color="selectedKeys.length > 0 ? '' : 'gray'">
										选择角色
										<p style="color: #8f959e">
											系统控制权限的最小原子是角色，通过
										</p>
										<p style="color: #8f959e">
											给用户分配角色来实现用户的权限控制。
										</p>
									</TimelineItem>
									<TimelineItem
										:color="
											selectedKeys.length > 0 && menuSelectedKeys.length > 0
												? ''
												: 'gray'
										"
										>选择菜单
										<p style="color: #8f959e">
											功能性菜单分配权限，系统级菜单仅超级管理员可以访问
										</p>
									</TimelineItem>
									<TimelineItem color="gray"
										>设置字段和按钮权限
										<p style="color: #8f959e">
											第三方链接页面无需设置以上权限
										</p></TimelineItem
									>
								</Timeline>
							</div>
						</template>
					</PC>
				</div>
			</LtPane>
		</LtSplitpanes>
	</LtPageLayout>
</template>

<script setup lang="ts">
import {
	LtPageLayout,
	LtSplitpanes,
	LtPane,
	LtDivider,
	LtTree,
	TreeItem,
} from '@lt-frame/components';
import {
	Input,
	Button,
	Tooltip,
	Tree,
	TreeProps,
	Timeline,
	TimelineItem,
	TypographyTitle,
	Tabs,
	TabPane,
} from 'ant-design-vue';
import {
	SearchOutlined,
	AlignLeftOutlined,
	CheckOutlined,
	CaretDownOutlined,
} from '@ant-design/icons-vue';
import { computed, h, onMounted, ref, toRaw, watch } from 'vue';
import { Condition, serialize } from '@lt-frame/utils';
import { eachTree, findTree, toArrayTree } from 'xe-utils';
import { useMessage } from '@lt-frame/hooks';
import axios from 'axios';
import { LtHttp } from '../../configs';
import PC from './components/pc.vue';
import { FeatureConfig } from '../../types';
import AccessControlGroup from './components/access-control-group.vue';

const { createMessage } = useMessage();

const treeLoading = ref(false);

const selectedKeys = ref<string[]>([]);

const treeData = ref<TreeItem[]>([]);

const menuData = ref<TreeProps['treeData']>([]);

const expandedKeys = ref<string[]>([]);

const menuSelectedKeys = ref<string[]>([]);

const menuCheckKeys = ref<any[]>([]);

const searchValue = ref<string>('');

const configTables = ref<any>([]);

const savePermission = ref<boolean>(false);

function onSavePermission() {
	const arr: any[] = [];
	configTables.value.forEach((table: any) => {
		arr.push(
			...table.items.map((item: any) => ({
				...getCurrentState.value,
				unchecked: toRaw(item.unchecked),
				type: item.type,
				tUid: item.tUid,
			}))
		);
	});
	savePermission.value = true;
	LtHttp.post({
		url: 'api/bsTablePermissionService/saveBsConfigPermissionByMap',
		data: serialize([arr]),
	})
		.then(() => {
			createMessage.success('保存成功');
		})
		.finally(() => {
			savePermission.value = false;
		});
}

watch(searchValue, () => {
	expandedKeys.value.length = 0;
	onExpanded();
});

watch(selectedKeys, () => {
	if (selectedKeys.value.length > 0) {
		findBsMenuPermissions();
	}
});

function onExpanded() {
	if (menuData.value) {
		if (expandedKeys.value.length === 0) {
			eachTree(menuData.value, (item) => {
				if (!item.isLeaf) {
					expandedKeys.value.push(item.key.toString());
				}
			});
		} else {
			expandedKeys.value.length = 0;
		}
	}
}

onMounted(() => {
	findTreeData();
	findModuleMenus();
});

/**
 * 查询全部的按钮，查询有权限的按钮两个请求合并触发
 */
function findTablePermission() {
	const condition = new Condition();
	condition.setTargetClass('test.app.model.BsConfigTable');
	condition.prop('parentMenu', getCurrentState.value.parentMenu);
	axios
		.all([
			LtHttp.post({
				url: 'api/bsConfigServiceImpl/findBsConfigTables',
				data: [condition],
			}),
			LtHttp.post({
				url: 'api/bsTablePermissionService/getUserTablePermissionListByRole',
				data: [getCurrentState.value.parentMenu, getCurrentState.value.roleId],
			}),
		])
		.then(
			axios.spread((resp1, resp2) => {
				const fn = (item: any) => ({
					key: item.id,
					...JSON.parse(item.tInfo),
				});
				const permissions = resp2.map(fn);
				const arr = resp1.map(fn).map((item: any) => {
					const obj: any = { title: item.tLabel, key: item.key, items: [] };
					const permission = permissions.find(
						(permission: any) => permission.key === item.key
					);
					if (item.columns) {
						obj.items.push({
							title: '字段',
							tUid: item.tUid,
							data: [
								...item.columns.map((col: any) => ({
									label: col.title,
									value: col.code,
								})),
							],
							type: 'COL',
							checks: permission.columns
								? [...permission.columns.map((col: any) => col.code)]
								: [],
							unchecked: [],
						});
					}
					if (item.toolButtons) {
						obj.items.push({
							title: '操作栏按钮',
							tUid: item.tUid,
							data: [
								...item.toolButtons.map((button: any) => ({
									label: button.title,
									value: button.code,
								})),
							],
							type: 'ACTION',
							checks: permission.toolButtons
								? [...permission.toolButtons.map((button: any) => button.code)]
								: [],
							unchecked: [],
						});
					}
					if (item.menuConfig) {
						obj.items.push({
							title: '右键菜单',
							tUid: item.tUid,
							type: 'RIGHTACTION',
							data: [
								...item.menuConfig.map((menu: any) => ({
									label: menu.name,
									value: menu.code,
								})),
							],
							checks: permission.menuConfig
								? [...permission.menuConfig.map((menu: any) => menu.code)]
								: [],
							unchecked: [],
						});
					}
					return obj;
				});
				configTables.value = arr;
			})
		);
}

// 选中的角色和菜单
const getCurrentState = computed(() => {
	const roleId =
		selectedKeys.value.length > 0 ? selectedKeys.value[0] : undefined;

	const parentMenu =
		menuSelectedKeys.value.length > 0
			? findTree(
					menuData.value ? menuData.value : [],
					(item: any) => item.key === menuSelectedKeys.value[0]
				).item.name
			: undefined;

	return {
		roleId,
		parentMenu,
	};
});

watch(getCurrentState, () => {
	configTables.value.length = 0;
	if (getCurrentState.value.roleId && getCurrentState.value.parentMenu) {
		findTablePermission();
	}
});

const saveMenuLoading = ref(false);
function onSaveMenu() {
	saveMenuLoading.value = true;
	const data = menuCheckKeys.value.map((item) => ({
		menuFid: item,
		roleId: selectedKeys.value[0],
	}));
	LtHttp.post({
		url: 'api/bsMenuPermissionService/saveBsMenuPermissions',
		data: serialize([data]),
	})
		.then(() => {
			createMessage.success('保存成功');
		})
		.finally(() => {
			saveMenuLoading.value = false;
		});
}

// 查询有权限的菜单id
function findBsMenuPermissions() {
	menuCheckKeys.value.length = 0;
	const condition = new Condition();
	condition.setTargetClass('bs.proconfig.model.BsMenuPermission');
	condition.prop('roleId', selectedKeys.value[0]);
	LtHttp.post({
		url: 'api/bsMenuPermissionService/findBsMenuPermissions',
		data: [condition],
	}).then((resp) => {
		resp.forEach((item: any) => {
			menuCheckKeys.value.push(item.menuFid);
		});
	});
}

/**
 * 查询角色列表
 */
function findTreeData() {
	treeLoading.value = true;
	treeData.value = [];
	selectedKeys.value = [];
	const condition = new Condition();
	condition.setTargetClass('lt.fw.security.model.Role');
	condition.expr("this.id !='1'");
	LtHttp.post({
		url: 'api/securityModelService/findRoles',
		data: [condition],
	})
		.then((resp) => {
			treeData.value = resp.map(
				(item: any) =>
					({
						title: JSON.stringify(item),
						key: item.id,
						icon: 'svg-icon:jiaose',
						row: item,
					}) as TreeItem
			);
		})
		.finally(() => {
			treeLoading.value = false;
		});
}

/**
 * 查询已经配置的菜单列表
 */
function findModuleMenus() {
	if (menuData.value) {
		menuData.value.length = 0;
	}
	const condition = new Condition();
	condition.setTargetClass('bs.configstore.model.BsModuleMenu');
	LtHttp.post<Array<FeatureConfig>>({
		url: 'api/bsMenuStoreServiceImpl/findModuleMenus',
		data: [condition],
	}).then((data) => {
		const tree = data.map((item) => ({
			title: item.title,
			key: item.fid,
			isLeaf: item.type !== 'group',
			parentId: item.parentId,
			name: item.name,
			orderNo: item.orderNo,
		}));

		const arr: any[] = toArrayTree(tree, {
			strict: true,
			parentKey: 'parentId',
			key: 'key',
			children: 'children',
		}).sort((a, b) => (a.orderNo || 0) - (b.orderNo || 0));
		menuData.value = [...arr];
	});
}
</script>
