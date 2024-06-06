import { Recordable } from '@lt-frame/utils';
import {
	VxeTablePropTypes,
	VxeTableDefines,
	VxeColumnPropTypes,
} from 'vxe-table';

export interface AjaxConfig {
	url: string;
	targetClass: string;
	columns: Array<Column>;
}

export interface Column {
	field: Recordable;
	title: string;
	type: string;
	width: number | string;
	fixed: VxeColumnPropTypes.Fixed;
	sortable: boolean;
	dataFormatter: string;
	numberFormatter: number;

	enumFormatter: {
		key: string;
		value: string | number | boolean;
	}[];
	editRules: VxeTableDefines.ValidatorRule;
	// 编辑和筛选时候type是实体的话需要配置的数据源配置
	extraDataSources: AjaxConfig;
}

/**
 * 设置器产出的对象
 */
export interface TableFields {
	// 列的配置
	columns: Array<Column>;
	// 高级
	seqColunms: boolean;
	radioColunms: boolean;
	checkboxColunms: boolean;

	// 全局配置
	stripe: boolean;
	round: boolean;
	border: boolean;
	size: string;
	align: string;
	showOverflow: boolean;
	// 列配置
	columnConfig: VxeTablePropTypes.ColumnConfig;
	// 编辑配置
	editConfig: VxeTablePropTypes.EditConfig;
}
