import { deepMerge } from '@lt-frame/utils';
import { VXETable, VXETableConfigOptions } from 'vxe-table';
import './cell/cell';
import './edit/edit';
import './filter/filter';
import './tool-bar/tool-bar';
import './empty/empty';

export * from './filter/src/advanced-filter';
export * from './filter/src/use-filter-data';
export * from './filter/src/use-reset-filter';
export * from './filter/src/util';
export * from './tool-bar/src/tool-business';
export * from './tool-bar/src/tool-function';
/**
 *  vxe table 插件全局配置
 */
export function LtTableConfig(config?: VXETableConfigOptions) {
	const opt = deepMerge(
		{
			table: {
				// 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
				stripe: true,
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
					// 开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
					range: true,
					// 开启复选框指定行选择功能（启用后通过鼠标点击和 shift 键选取指定范围的行）
					isShiftKey: true,
					// 严格模式，当数据为空或全部禁用时，列头的复选框为禁用状态
					strict: true,
				},
				// 列配置信息
				columnConfig: {
					// 每一列是否启用列宽调整
					resizable: true,
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
					showAsterisk: false,
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
			grid: {
				// 是否带有斑马纹（需要注意的是，在可编辑表格场景下，临时插入的数据不会有斑马纹样式）
				stripe: true,
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
					// 开启复选框范围选择功能（启用后通过鼠标在复选框的列内滑动选中或取消指定行）
					range: true,
					// 开启复选框指定行选择功能（启用后通过鼠标点击和 shift 键选取指定范围的行）
					isShiftKey: true,
					// 严格模式，当数据为空或全部禁用时，列头的复选框为禁用状态
					strict: true,
				},
				// 列配置信息
				columnConfig: {
					// 每一列是否启用列宽调整
					resizable: true,
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
					showAsterisk: false,
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
		} as VXETableConfigOptions,
		config
	);

	VXETable.config(opt);
}