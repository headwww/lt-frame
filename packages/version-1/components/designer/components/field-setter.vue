<template>
	<TreeSelect
		v-model:value="data.fieldName"
		tree-data-simple-mode
		style="width: 100%"
		:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
		:tree-data="treeData"
		:load-data="onLoadData"
		:tree-line="true && { showLeafIcon: false }"
		treeNodeLabelProp="value"
		@select="onSelect"
	>
	</TreeSelect>
</template>
<script lang="ts" setup>
import { TreeSelect, notification, type TreeSelectProps } from 'ant-design-vue';
import { PropType, computed, reactive, ref, watch } from 'vue';
import { ISettingField } from '@lt-frame/components';
import { LtHttp } from '../../../configs';

const props = defineProps({
	value: {
		type: Object as PropType<Field>,
		default: () => {},
	},
	field: {
		type: Object as PropType<ISettingField>,
		default: () => {},
	},
	// 直接在协议中设置好的
	path: String,
	// 通过其他设置器拿到的实体路径
	setterPath: String,
});

watch(
	() => props.value,
	() => {
		data.fieldCommnet = props.value.fieldCommnet;
		data.fieldName = props.value.fieldName;
		data.fieldTypeFlag = props.value.fieldTypeFlag;
		data.fieldType = props.value.fieldType;
		data.parentType = props.value.fieldType;
	}
);

const data = reactive<Field>({
	...props.value,
});

const emit = defineEmits(['change']);

const onSelect = (v: any) => {
	const find = treeData.value?.find((item) => item.id === v);

	find && find.isLeaf && emit('change', find);
};

const treeData = ref<TreeSelectProps['treeData']>([]);

const onLoadData = (treeNode: any) =>
	new Promise((resolve) => {
		postLoad(treeNode.fieldType).then((data) => {
			const tree = data.map((item) => {
				const id = treeNode.id.concat('.').concat(item.fieldName);
				return {
					id,
					value: id,
					pId: treeNode.dataRef.id,
					title: `${item.notNull === 1 ? '*' : ''}${item.fieldName}  (${
						item.fieldCommnet
					})`,
					fieldType: item.fieldType,
					parentType: treeNode.fieldType,
					fieldCommnet: item.fieldCommnet,
					enumInfo: item.enumInfo,
					fieldName: id,
					fieldTypeFlag: item.fieldTypeFlag,
					isLeaf: item.fieldTypeFlag !== '1',
				};
			});

			treeData.value = treeData.value?.concat(tree);

			resolve(true);
		});
	});

interface Field {
	fieldCommnet: string;
	fieldName: string;
	fieldType: string;
	notNull: number;
	fieldTypeFlag: string;
	parentType?: string;
	enumInfo?: Array<{
		value: string | number;
		key: string;
	}>;
}

function postLoad(className: string) {
	return LtHttp.post<Field[]>({
		url: 'api/testServiceImpl/getFieldListByClass',
		data: [
			[
				{
					className,
				},
			],
		],
	});
}

const getPath = computed(() => {
	const { path } = props;
	return path!!;
});

if (props.setterPath) {
	const path = props.field
		.getProps()
		.getPropValue(
			props.field.path.slice(0, 2).concat(props.setterPath).join('.')
		);
	postLoad(path)
		.then((data) => {
			treeData.value = [
				...data.map((item) => ({
					id: item.fieldName,
					pId: 0,
					value: item.fieldName,
					title: `${item.notNull === 1 ? '*' : ''}${item.fieldName}  (${
						item.fieldCommnet
					})`,
					isLeaf: item.fieldTypeFlag !== '1',
					fieldType: item.fieldType,
					fieldCommnet: item.fieldCommnet,
					fieldName: item.fieldName,
					fieldTypeFlag: item.fieldTypeFlag,
					enumInfo: item.enumInfo,
				})),
			];
		})
		.catch(() => {
			notification.error({
				duration: 3,
				message: '请配置实体路径',
				style: {
					zIndex: 3000,
				},
			});
		});
} else {
	postLoad(getPath.value).then((data) => {
		treeData.value = [
			...data.map((item) => ({
				id: item.fieldName,
				pId: 0,
				value: item.fieldName,
				title: `${item.notNull === 1 ? '*' : ''}${item.fieldName}  (${
					item.fieldCommnet
				})`,
				isLeaf: item.fieldTypeFlag !== '1',
				fieldType: item.fieldType,
				fieldCommnet: item.fieldCommnet,
				fieldName: item.fieldName,
				fieldTypeFlag: item.fieldTypeFlag,
				enumInfo: item.enumInfo,
			})),
		];
	});
}
</script>
