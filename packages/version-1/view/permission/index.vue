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
						<template #right>
							<LtDivider title="功能权限">
								<template #extra>
									<Button style="margin-right: 12px" type="primary"
										>保存</Button
									>
								</template>
							</LtDivider>
							<AccessControlGroup title="个人信息"></AccessControlGroup>
							<div
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
									<TimelineItem color="gray">设置字段和按钮权限</TimelineItem>
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
} from 'ant-design-vue';
import {
	SearchOutlined,
	AlignLeftOutlined,
	CheckOutlined,
	CaretDownOutlined,
} from '@ant-design/icons-vue';
import { h, onMounted, ref, watch } from 'vue';
import { Condition, serialize } from '@lt-frame/utils';
import { eachTree, toArrayTree } from 'xe-utils';
import { useMessage } from '@lt-frame/hooks';
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

const menuCheckKeys = ref<string[]>([]);

const searchValue = ref<string>('');

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
		}));

		const arr: any[] = toArrayTree(tree, {
			strict: true,
			parentKey: 'parentId',
			key: 'key',
			children: 'children',
		});
		menuData.value = [...arr];
	});
}
</script>
