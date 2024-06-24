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

export interface MenuOptions {
	code?: string;
	name?: string;
	// 绑定的点击事件
	bindClick: string;
	// 是否禁用
	isDisabled?: DatasourceContrast;
}
export interface Column {
	field?: Recordable;
	// 当字段类型为java.lang.Boolean时候需要设置的用来格式化的文本，默认是，是否
	boolTrue: string;
	boolFalse: string;
	title?: string;
	type?: string;
	parentType?: string;
	width?: number | string;
	fixed?: VxeColumnPropTypes.Fixed;
	isEdit?: boolean;
	showTime?: boolean;
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
	tUid?: string;
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
	border?: string;
	editTrigger?: string;
	editMode?: string;

	// 列配置
	columnConfig?: VxeTablePropTypes.ColumnConfig;
	toolButtons?: ToolButtons[];

	// 右键菜单
	menuConfig?: MenuOptions[];

	// 操作列配置
	isOperationColumn?: boolean;
	editButton?: boolean;
	viewButton?: boolean;
	viewBindClick?: string;
}
