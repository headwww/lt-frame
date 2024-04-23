import { TreeDataItem } from 'ant-design-vue/es/tree';
import { PropType } from 'vue';

export interface LtTreeItem extends TreeDataItem {
	icon?: any;
}

export const treeProps = {
	treeData: {
		type: Array as PropType<TreeDataItem[]>,
	},
};
