import { VxeTablePropTypes, VxeColumnPropTypes } from 'vxe-table';
import { Recordable } from '@lt-frame/utils';
import { ButtonType } from 'ant-design-vue/lib/button';

// 数据源对照关系
export interface DatasourceContrast {
	// 所属的数据源，内置数据源还是自定义数据源
	type?: string;
	// 数据源的key
	key?: string;
}

export interface Column {
	field?: Recordable;
	title?: string;
	type?: string;
	parentType?: string;
	width?: number | string;
	fixed?: VxeColumnPropTypes.Fixed;
	isEdit?: boolean;
	dataProps?: boolean;
	sortable?: boolean;
	json?: Array<{
		required?: boolean;
		min?: number;
		max?: number;
		pattern?: string;
		message?: string;
	}>;
	entityPath?: string;
	entityColumn?: Column[];
	datasourceContrast?: DatasourceContrast;
	dataFormatter?: string;
	numberFormatter?: number;
}

export interface ToolButtons {
	title: string;
	type: ButtonType;
	// 是否禁用的数据源的key
	bindDisabled: DatasourceContrast;
	// 绑定的点击事件
	bindClick: string;
}

/**
 * 设置器产出的对象
 */
export interface TableFields {
	// 列的配置
	columns?: Array<Column>;
	// 高级
	seq?: boolean;
	radio?: boolean;
	checkbox?: boolean;

	// 全局配置
	stripe?: boolean;
	size?: string;
	align?: string;
	showOverflow?: boolean;
	// 列配置
	columnConfig?: VxeTablePropTypes.ColumnConfig;
	// 编辑配置
	editConfig?: VxeTablePropTypes.EditConfig;
	toolButtons?: ToolButtons[];
}
