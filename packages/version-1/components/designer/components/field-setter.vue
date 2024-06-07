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
import { TreeSelect, type TreeSelectProps } from 'ant-design-vue';
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
	path: String,
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
	emit('change', find);
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
					title: `${item.fieldName}  (${item.fieldCommnet})`,
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
postLoad(getPath.value).then((data) => {
	treeData.value = [
		...data.map((item) => ({
			id: item.fieldName,
			pId: 0,
			value: item.fieldName,
			title: `${item.fieldName}  (${item.fieldCommnet})`,
			isLeaf: item.fieldTypeFlag !== '1',
			fieldType: item.fieldType,
			fieldCommnet: item.fieldCommnet,
			fieldName: item.fieldName,
			fieldTypeFlag: item.fieldTypeFlag,
			enumInfo: item.enumInfo,
		})),
	];
});
</script>
