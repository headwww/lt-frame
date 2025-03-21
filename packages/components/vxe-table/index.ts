import { deepMerge } from '@lt-frame/utils';
import { VxeUI, VxeGlobalConfig } from 'vxe-table';
import ExcelJS from 'exceljs';
import ltFunction from './tool-bar/src/lt-function.vue';
import ltBusiness from './tool-bar/src/lt-business.vue';
import './cell/cell';
import './edit/edit';
import './filter/filter';
import './tool-bar/tool-bar';
import './empty/empty';
import './formatter/formatter';
import VXETablePluginExportXLSX from './import-export/excle';

export const LtFunction = ltFunction;
export const LtBusiness = ltBusiness;

export const LtExportXLSX = VXETablePluginExportXLSX;

export * from './filter/src/advanced-filter';
export * from './filter/src/use-filter-data';
export * from './filter/src/use-reset-filter';
export * from './filter/src/util';
export * from './tool-bar/src/tool-business';
export * from './tool-bar/src/tool-function';
/**
 *  vxe table 插件全局配置
 */
export function LtTableConfig(config?: VxeGlobalConfig) {
	const opt = deepMerge(
		{
			table: {
				border: 'none',
				// 表格的尺寸
				size: 'small',
				// 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
				showOverflow: true,
				// 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
				keepSource: true,
				// 响应式宽高
				autoResize: true,
				height: 'auto',
				// 默认开启虚拟滚动
				scrollY: { enabled: true },
				// 复选框配置项
				checkboxConfig: {
					// 绑定选中属性（行数据中必须存在该字段，否则无效）
					checkField: '$_checked',
					// 触发方式（注：当多种功能重叠时，会同时触发）
					trigger: 'cell',
					// 高亮勾选行
					highlight: true,
					// 严格模式，当数据为空或全部禁用时，列头的复选框为禁用状态
					strict: true,
				},
				// 列配置信息
				columnConfig: {
					// 每一列是否启用列宽调整
					resizable: true,
					// 是否启用列拖拽
					drag: true,
				},
				// 可编辑配置项
				editConfig: {
					// 触发方式
					trigger: 'manual',
					// 编辑模式
					mode: 'row',
					// 只对 keep-source 开启有效，是否显示单元格新增与修改状态
					showStatus: true,
					// 是否显示必填字段的红色星号
					showAsterisk: true,
				},
				// 行配置信息
				rowConfig: {
					// 当鼠标移到行时，是否要高亮当前行
					isHover: true,
					// 当鼠标点击行时，是否要高亮当前行
					isCurrent: true,
				},
				emptyRender: {
					name: '$lt-empty',
				},
				// 自定义配置
				customConfig: {
					// 是否启用列拖拽 弹窗模式
					mode: 'modal',
					// 是否启用列拖拽 弹窗模式
					allowVisible: false,
					// 是否启用列拖拽 弹窗模式
					allowFixed: false,
					// 是否启用列拖拽 弹窗模式
					allowResizable: false,
					// 是否启用列拖拽 弹窗模式
					allowSort: true,
				},
			},
			grid: {
				border: 'none',
				// 表格的尺寸
				size: 'small',
				// 设置所有内容过长时显示为省略号（如果是固定列建议设置该值，提升渲染速度）
				showOverflow: true,
				// 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
				keepSource: true,
				// 响应式宽高
				autoResize: true,
				height: 'auto',
				// 默认开启虚拟滚动
				scrollY: { enabled: true },
				// 复选框配置项
				checkboxConfig: {
					// 绑定选中属性（行数据中必须存在该字段，否则无效）
					checkField: '$_checked',
					// 触发方式（注：当多种功能重叠时，会同时触发）
					trigger: 'cell',
					// 高亮勾选行
					highlight: true,
					// 严格模式，当数据为空或全部禁用时，列头的复选框为禁用状态
					strict: true,
				},
				// 列配置信息
				columnConfig: {
					// 每一列是否启用列宽调整
					resizable: true,
					// 是否启用列拖拽
					drag: true,
				},
				customConfig: {
					// 是否启用列拖拽 弹窗模式
					mode: 'modal',
					// 是否启用列拖拽 弹窗模式
					allowVisible: false,
					// 是否启用列拖拽 弹窗模式
					allowFixed: false,
					// 是否启用列拖拽 弹窗模式
					allowResizable: false,
					// 是否启用列拖拽 弹窗模式
					allowSort: true,
				},
				// 可编辑配置项
				editConfig: {
					// 触发方式
					trigger: 'manual',
					// 编辑模式
					mode: 'row',
					// 只对 keep-source 开启有效，是否显示单元格新增与修改状态
					showStatus: true,
					// 是否显示必填字段的红色星号
					showAsterisk: true,
				},
				// 行配置信息
				rowConfig: {
					// 当鼠标移到行时，是否要高亮当前行
					isHover: true,
					// 当鼠标点击行时，是否要高亮当前行
					isCurrent: true,
				},
				emptyRender: {
					name: '$lt-empty',
				},
			},
		},
		config
	);

	VxeUI.setConfig(opt);
	VxeUI.use(VXETablePluginExportXLSX, {
		ExcelJS,
	});
}

export const LtTablePlugins = {
	// 内置的工具栏Button按钮
	ToolFunction: '$lt-tool-function',
	// 内置的工具栏Tool按钮
	ToolBusiness: '$lt-tool-business',
	// 格式化工具 保留几位小数默认两位，加单位
	FormatterToFixedUnit: '$lt-formatter-to-fixed-unit',
	// 格式化日期默认是yyyy-MM-dd HH:mm:ss
	FormatterTime: '$lt-formatter-time',
	// 格式化时分秒
	FormatterTimeHMS: '$lt-formatter-enum-hms',
	// 格式化枚举
	FormatterEnum: '$lt-formatter-enum',
	// 格式化枚举Array<{key:string,value:string|number|boole}>
	FormatterEnum2: '$lt-formatter-enum-key-value',
	// 高级筛选
	FilterAdvanced: '$lt-filter',
	// 空数据渲染
	DefaultEmpty: '$lt-default-empty',
	// 空数据渲染antv的Empty组件
	AntvEmpty: '$lt-empty',
	// 单元格渲染，操作列单元格
	CellOperate: '$lt-cell-operate',
	// 编辑渲染 input
	EditInput: '$lt-edit-input',
	// 编辑渲染 input-number
	EditInputNumber: '$lt-edit-input-number',
	// 编辑渲染 date-picker
	EditDatePicker: '$lt-edit-date-picker',
	// 编辑渲染 time-picker
	EditTimePicker: '$lt-edit-time-picker',
	// 编辑渲染 select
	EditSelect: '$lt-edit-select',
	// 编辑渲染 entity
	EditEntity: '$lt-edit-entity',
	EditEntityPager: '$lt-edit-entity-pager',
	// 编辑渲染 bool
	EditBool: '$lt-edit-bool',
};
