import { VxeGridProps, VxeTableDataRow, VxeGridPropTypes } from 'vxe-table';
import { OperateColumConfig } from './components/grid-operate-column';

/**
 * 重构列加入from可以使用的字段
 */
export interface LtColumns<D = VxeTableDataRow>
	extends VxeGridPropTypes.Columns<D> {}

/**
 * 重构表单
 */
export interface LtGridProps<D = VxeTableDataRow> extends VxeGridProps<D> {
	// 是否开启滚动 默认开启
	thumb?: boolean;
	// 是否开启默认序号，也可以在外部的columns中设置{ type: 'seq', width: 40, fixed: 'left' },
	enableSeq?: boolean;
	// 是否开启默认的check 也可以在外部的columns中设置{ type: 'checkbox', width: 40, fixed: 'left' },
	enableCheckbox?: boolean;
	// 列配置
	columns?: LtColumns<D>;
	// 内置操作列的配置
	operateColumConfig?: OperateColumConfig;
}
