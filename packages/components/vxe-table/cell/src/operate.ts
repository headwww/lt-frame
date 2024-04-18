import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';

export interface OperationOption {
	// 是否显示按钮
	visible?: boolean | Fn<any, boolean>;
	// 是否禁用按钮
	disabled?: boolean | Fn<any, boolean>;
	// 显示文本
	text?: string;
	// 图标
	icon?: string;
	// 点击事件的
	event: string | number;
}

export const operateProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderDefaultParams>,
	// 编辑按钮
	editVisible: {
		type: [Boolean, Function] as PropType<boolean | Fn<any, boolean>>,
	},
	editDisabled: {
		type: [Boolean, Function] as PropType<boolean | Fn<any, boolean>>,
	},
	// 查看按钮
	viewVisible: {
		type: [Boolean, Function] as PropType<boolean | Fn<any, boolean>>,
	},
	viewDisabled: {
		type: [Boolean, Function] as PropType<boolean | Fn<any, boolean>>,
	},
	//  其他按钮
	buttons: {
		type: Array as PropType<Array<Omit<OperationOption, 'icon'>>>,
	},
	// 更多菜单
	menus: {
		type: Array as PropType<Array<OperationOption>>,
	},
};

export type OperateProps = ExtractPropTypes<typeof operateProps>;
