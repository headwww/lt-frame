<!--
 * @Description: 功能配置
 * @Author: sw
-->
<template>
	<LtPageLayout>
		<div class="fcm-box">
			<LtDivider title="用户端导航栏配置" style="margin-top: 30px"></LtDivider>
			<Alert
				message="管理员可配置客户端导航栏，调整导航栏中的应用数量及顺序，还能自定义配置客户端导航栏应用名称，实现企业个性化定制。"
				type="info"
				show-icon
				style="margin-top: 12px"
			/>
			<div class="fcm-title">
				<div class="fcm-title-span">导航栏默认配置</div>
				<AButton v-if="!edit" @click="onEdit" :icon="h(EditOutlined)">
					编辑导航
				</AButton>
				<Space v-else>
					<AButton @click="onCancel">取消</AButton>
					<AButton :loading="saveLoading" type="primary" @click="onSave">
						保存
					</AButton>
				</Space>
			</div>

			<div class="fcm-menu">
				<FeatureMenu
					@add="onCreate"
					@item="onItem"
					@remove="onRemove"
					v-model:list="list"
					:edit="edit"
					:events="events"
				></FeatureMenu>
				<PreviewPc>
					<AMenu mode="inline" :selectable="false">
						<template v-for="item in items" :key="item.path">
							<SubMenuItem :item="item" />
						</template>
					</AMenu>
				</PreviewPc>
			</div>
		</div>
		<ModalAddGroup
			:edit="edit"
			v-model:open="gorupOpen"
			:data="groupData"
			@ok="onAddGroup"
		></ModalAddGroup>
	</LtPageLayout>
</template>

<script lang="ts">
import { Alert, Button as AButton, Space, Menu as AMenu } from 'ant-design-vue';
import { LtDivider, LtPageLayout } from '@lt-frame/components';
import { h, ref, watch, onMounted, defineComponent } from 'vue';
import { EditOutlined, FolderOpenOutlined } from '@ant-design/icons-vue';
import { eachTree, findTree, toArrayTree, toTreeArray } from 'xe-utils';
import { cloneDeep, omit } from 'lodash-es';
import { Condition, serialize } from '@lt-frame/utils';
import { useMessage } from '@lt-frame/hooks';
import PreviewPc from './components/preview-pc.vue';
import FeatureMenu from './components/feature-menu.vue';
import { FeatureConfig } from '../../types';
import ModalAddGroup from './components/modal-add-group.vue';
import { generateRoutes, uniqueId } from './components/utils';
import { transformRouteToMenu } from '../../router/helper/menuHelper';
import SubMenuItem from '../../layout/default/sider/components/sub-menu-item.vue';
import { LtHttp } from '../../configs';

export default defineComponent({
	name: 'FeatureConfigManager',
	components: {
		Alert,
		Space,
		AMenu,
		AButton,
		LtDivider,
		LtPageLayout,
		PreviewPc,
		FeatureMenu,
		ModalAddGroup,
		SubMenuItem,
	},
	setup() {
		const edit = ref(false);
		const list = ref<FeatureConfig[]>([]);
		const rawData = ref<FeatureConfig[]>([]);
		const items = ref<any[]>([]);

		const events = ref([
			{ code: 0, title: '创建应用组', icon: h(FolderOpenOutlined) },
		]);

		const gorupOpen = ref(false);

		const groupData = ref();

		function onEdit() {
			edit.value = !edit.value;
		}

		function onCreate() {
			groupData.value = {
				fid: uniqueId('root-'),
			};
			gorupOpen.value = true;
		}

		function onItem(params: FeatureConfig) {
			groupData.value = {
				...params,
			};
			gorupOpen.value = true;
		}

		function onRemove(params: FeatureConfig) {
			const find = findTree([params], (item) => item.notNewly === true);
			if (find) {
				createErrorModal({
					title: '提示',
					content:
						'该菜单组内已有功能分配过权限，请谨慎删除，删除后仅能撤回菜单，已配置的权限无法找回！！！',
					okText: '删除',
					okButtonProps: {
						danger: true,
					},
					okCancel: true,
					onOk: () => {
						const arr = [cloneDeep(params)];
						const treeArray = toTreeArray(arr);
						const ids: any[] = [];
						treeArray.forEach((item) => {
							if (item.notNewly) {
								ids.push(item.fid!!);
							}
						});
						LtHttp.post(
							{
								url: 'api/bsMenuPermissionService/deleteMenuPermissions',
								data: [ids],
							},
							{ isParameters: true }
						).finally(() => {
							const index = list.value.findIndex(
								(item) => params.fid === item.fid
							);
							list.value.splice(index!!, 1);
						});
					},
				});
			} else {
				const index = list.value.findIndex((item) => params.fid === item.fid);
				list.value.splice(index!!, 1);
			}
		}

		function onAddGroup(data: FeatureConfig) {
			const index = list.value.findIndex((item) => data.fid === item.fid);
			if (index === undefined || index === -1) {
				list.value.push({
					...data,
				});
				return;
			}
			list.value.splice(index, 1, { ...data });
		}

		function onCancel() {
			list.value = [...cloneDeep(rawData.value)];
			edit.value = false;
		}

		watch(
			() => list.value,
			() => {
				eachTree(list.value, (item, index) => {
					item.orderNo = index;
				});
				const routes = generateRoutes(list.value);
				const menuList = transformRouteToMenu(routes);
				menuList.sort(
					(a, b) => (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0)
				);
				items.value = menuList;
			},
			{
				deep: true,
				immediate: true,
			}
		);

		onMounted(() => {
			findModuleMenus();
		});

		function findModuleMenus() {
			const condition = new Condition();
			condition.setTargetClass('bs.configstore.model.BsModuleMenu');
			LtHttp.post<Array<FeatureConfig>>({
				url: 'api/bsMenuStoreServiceImpl/findModuleMenus',
				data: [condition],
			}).then((data) => {
				const arr = toArrayTree(
					// notNewly 非新创建的是服务端返回的
					data.map((item) => ({ ...item, notNewly: true })),
					{
						strict: false,
						parentKey: 'parentId',
						key: 'fid',
						children: 'children',
					}
				).sort((a, b) => (a.orderNo || 0) - (b.orderNo || 0));

				list.value = [...arr];
				rawData.value = [...cloneDeep(arr)];
			});
		}

		const { createMessage, createErrorModal } = useMessage();

		const saveLoading = ref(false);

		function onSave() {
			saveLoading.value = true;
			const arr = toTreeArray(list.value).map((item: any) => ({
				...omit(item, 'children', 'notNewly'),
			}));

			LtHttp.post(
				{
					url: 'api/bsMenuStoreServiceImpl/saveModuleMenus',
					data: serialize([arr]),
				},
				{ isParameters: true }
			)
				.then(() => {
					window.location.reload(); // 直接刷新浏览器
					edit.value = false;
					createMessage.success('保存成功');
					// findModuleMenus();
				})
				.finally(() => {
					saveLoading.value = false;
				});
		}

		return {
			edit,
			list,
			items,
			events,
			gorupOpen,
			groupData,
			saveLoading,
			EditOutlined,
			h,
			onEdit,
			onCreate,
			onItem,
			onRemove,
			onAddGroup,
			onCancel,
			onSave,
		};
	},
});
</script>
