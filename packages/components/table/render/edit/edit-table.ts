import {
	VxeColumnProps,
	VxeGlobalRendererHandles,
	VxePulldownProps,
} from 'vxe-table';
import { ExtractPropTypes, PropType } from 'vue';
import { InputProps } from 'ant-design-vue';
import { LTTableProps } from '../../src/table';

export const editTableProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderEditParams>,
	/** 设置表各的数据源 请求的方式 */
	tableDatePromise: Function as PropType<() => Promise<any>>,
	/** 设置表格数据源 数组的方式，tableDatePromise权重高一些 */
	tableDate: Array<any>,
	colConfigs: {
		type: Object as PropType<VxeColumnProps[]>,
		default: [],
	},
};

export type EditTableProps = ExtractPropTypes<typeof editTableProps>;

export interface EditTableAttrs {
	inputAttrs?: InputProps;
	vxePulldownAttrs?: VxePulldownProps;
	tableAttrs?: Omit<LTTableProps, 'colConfigs' | 'data'>;
}
