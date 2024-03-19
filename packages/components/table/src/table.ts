import type { VxeColumnProps } from 'vxe-table';

// export interface TableProps extends VxeTableProps {
// 	seqVisibility: boolean;
// 	checkboxVisibility: boolean;
// 	isEditable: boolean;
// 	colConfigs: Array<VxeColumnProps>;
// }

export const tableProps = {
	// 是否开启工具栏
	enableToolbar: { type: Boolean, default: true },
	// 序号的可见性
	seqVisibility: { type: Boolean, default: true },
	// checkbox的可见性
	checkboxVisibility: { type: Boolean, default: true },
	// 是否可编辑
	isEditable: { type: Boolean, default: true },
	// 是否开启滚动条
	thumb: { type: Boolean, default: true },
	// 主子表组件内部的column的类型
	colConfigs: { type: Array<VxeColumnProps>, default: [] },
};
