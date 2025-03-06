<!--
 * @Description: 新增一个vue功能
 * @Author: sw
-->
<template>
	<LtModal
		v-model:open="mOpen"
		title="应用组设置"
		width="900px"
		destroy-on-close
		:ok-button-props="{
			disabled: getDisable,
		}"
		@ok="onOk"
	>
		<div style="height: 460px">
			<div style="display: flex">
				<div style="width: 400px">
					<LtDivider title="配置组信息"></LtDivider>
					<AForm layout="vertical" :model="formState" :rules="rules">
						<FormItem label="应用组名称" name="title">
							<AInput v-model:value="formState.title" />
						</FormItem>
						<FormItem
							label="路径"
							tooltip="输入路径单独的单词即可，不可以出现中文，不可以出现/\%@#&*()^等特殊字符"
							name="path"
						>
							<AInput v-model:value="formState.path" />
						</FormItem>
						<FormItem label="展示图标" name="icon">
							<IconSelector v-model:value="formState.icon" :list="svgs">
							</IconSelector>
						</FormItem>
					</AForm>
				</div>
				<div style="margin-left: 20px">
					<LtDivider title="应用列表" style="margin-bottom: 20px"></LtDivider>
					<FeatureMenu
						v-model:list="formState.children"
						@add="onCreate"
						@item="onItem"
						@remove="onRemove"
						:edit="edit"
						:events="events"
					></FeatureMenu>
				</div>
			</div>
		</div>
		<ModalAddGroup
			:edit="edit"
			v-model:open="gorupOpen"
			:data="formData"
			@ok="onAdd"
		></ModalAddGroup>
		<ModalAddFeature
			:edit="edit"
			:data="formData"
			v-model:open="featureOpen"
			@ok="onAdd"
		></ModalAddFeature>
		<ModalAddLink
			:edit="edit"
			:data="formData"
			v-model:open="liknOpen"
			@ok="onAdd"
		></ModalAddLink>
	</LtModal>
</template>

<script lang="ts">
import { Form as AForm, FormItem, Input as AInput } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/es/form';
import { LtDivider, LtModal } from '@lt-frame/components';
import { computed, PropType, ref, watch, h, defineComponent } from 'vue';
import { cloneDeep, isUndefined } from 'lodash-es';
import {
	AppstoreOutlined,
	FolderOpenOutlined,
	LinkOutlined,
} from '@ant-design/icons-vue';
import { findTree, toTreeArray } from 'xe-utils';
import { useMessage } from '@lt-frame/hooks';
import { LtHttp, svgs } from '../../../configs';
import FeatureMenu from './feature-menu.vue';
import { FeatureConfig } from '../../../types';
import ModalAddFeature from './modal-add-feature.vue';
import IconSelector from './icon-selector.vue';
import ModalAddLink from './modal-add-link.vue';
import { uniqueId, validatorSpecialChars } from './utils';

export default defineComponent({
	name: 'ModalAddGroup',
	inheritAttrs: false,
	props: {
		open: Boolean,
		edit: Boolean,
		data: {
			type: Object as PropType<FeatureConfig>,
		},
	},
	emits: ['update:open', 'ok'],
	components: {
		FeatureMenu,
		ModalAddFeature,
		IconSelector,
		ModalAddLink,
		LtDivider,
		LtModal,
		AForm,
		FormItem,
		AInput,
	},
	setup(props, { emit }) {
		const mOpen = ref(props.open);

		const events = ref([
			{ code: 'group', title: '创建应用组', icon: h(FolderOpenOutlined) },
			{ code: 'link', title: '通过链接添加', icon: h(LinkOutlined) },
			{
				code: 'feature',
				title: '在已安装应用中选择',
				icon: h(AppstoreOutlined),
			},
		]);

		watch(
			() => props.open,
			() => {
				mOpen.value = props.open;
			}
		);

		watch(
			() => mOpen.value,
			() => {
				emit('update:open', mOpen.value);
			}
		);

		watch(
			() => props.data,
			() => {
				formState.value = {
					...props.data,
					children: props.data?.children ? props.data?.children : [],
				};
			},
			{ deep: true }
		);

		const formState = ref<FeatureConfig>({
			...props.data,
			children: props.data?.children ? props.data?.children : [],
		});

		const validatorPath = async (_rule: Rule, value: string) => {
			const chineseRegex = /[\u4e00-\u9fa5]/;
			if (chineseRegex.test(value)) {
				// eslint-disable-next-line prefer-promise-reject-errors
				return Promise.reject('禁止输入中文');
			}
			return Promise.resolve();
		};

		const rules = ref<Record<string, Rule[]>>({
			title: [{ required: true, message: '请填写应用名称' }],
			path: [
				{ required: true, message: '请填写路径' },
				{
					validator: validatorPath,
				},
				{
					validator: validatorSpecialChars,
				},
			],
		});

		const getDisable = computed(
			() =>
				!props.edit ||
				isUndefined(formState.value.title) ||
				formState.value.title === '' ||
				formState.value.children?.length === 0
		);

		async function onOk() {
			emit('ok', {
				...formState.value,
				type: 'group',
			});
			mOpen.value = false;
		}

		const gorupOpen = ref(false);

		const featureOpen = ref(false);

		const liknOpen = ref(false);

		const formData = ref();

		function onCreate(index: number | string) {
			formData.value = {
				fid: uniqueId(`${index}-`),
				parentId: formState.value.fid,
			};
			if (index === 'group') {
				gorupOpen.value = true;
			}
			if (index === 'link') {
				liknOpen.value = true;
			}
			if (index === 'feature') {
				featureOpen.value = true;
			}
		}

		function onItem(params: FeatureConfig) {
			formData.value = {
				...params,
			};
			if (params.type === 'group') {
				gorupOpen.value = true;
			} else if (params.type === 'feature') {
				featureOpen.value = true;
			} else if (params.type === 'link') {
				liknOpen.value = true;
			}
		}

		const { createErrorModal } = useMessage();

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
						const treeArray = toTreeArray(arr, { updated: false });
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
							{ isParameters: true, noClearData: true }
						).finally(() => {
							const index = formState.value.children?.findIndex(
								(item) => params.fid === item.fid
							);
							formState.value.children?.splice(index!!, 1);
						});
					},
				});
			} else {
				const index = formState.value.children?.findIndex(
					(item) => params.fid === item.fid
				);
				formState.value.children?.splice(index!!, 1);
			}
		}

		function onAdd(data: FeatureConfig) {
			const index = formState.value.children?.findIndex(
				(item) => data.fid === item.fid
			);
			if (index === undefined || index === -1) {
				formState.value.children?.push({
					...data,
				});
				return;
			}
			formState.value.children?.splice(index, 1, { ...data });
		}

		return {
			mOpen,
			events,
			formState,
			rules,
			getDisable,
			gorupOpen,
			featureOpen,
			liknOpen,
			formData,
			svgs,
			onOk,
			onCreate,
			onItem,
			onRemove,
			onAdd,
		};
	},
});
</script>
