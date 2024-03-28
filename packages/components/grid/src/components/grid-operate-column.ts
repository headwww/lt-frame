import { Fn } from '@lt-frame/utils';
import { PropType } from 'vue';

export interface OperationOption {
	// 是否显示按钮
	visible?: boolean | Fn<boolean>;
	// 是否禁用按钮
	disabled?: boolean | Fn<boolean>;
	// 显示文本
	text?: string;
	// 图标
	icon?: string;
	// 点击事件的
	event?: string | number;
	// 文本颜色
	color?: string;
}

export interface OperateColumConfig {
	// 编辑栏的宽度
	width?: number;
	// 编辑按钮
	editVisible?: boolean | Fn<any, boolean>;
	editDisabled?: boolean | Fn<any, boolean>;
	// 查看按钮的操作
	viewVisible?: boolean | Fn<any, boolean>;
	viewDisabled?: boolean | Fn<any, boolean>;
	// 其他按钮
	buttons?: Array<Omit<OperationOption, 'icon' | 'color'>>;
	// 更多菜单
	menus?: Array<OperationOption>;
	// 查看按钮的点击事件
	onViewClick?: (params?: any) => any;
	// buttons内配置的按钮的点击事件
	onButtonsItemClick?: (event?: string | number, params?: any) => any;
	// 更多菜单内配置的按钮的点击事件
	onMenusItemClick?: (event?: string | number, params?: any) => any;
}

export const gridOperateColumProps = {
	operateColumConfig: Object as PropType<OperateColumConfig>,
	params: Object as PropType<any>,
};
