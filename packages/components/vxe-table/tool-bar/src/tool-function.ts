import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';

type ToolConfig =
	| boolean
	| Fn<VxeGlobalRendererHandles.RenderButtonParams, boolean>;

export const toolFunctionProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderButtonParams>,
	options: {
		type: Array as PropType<ToolButtonOptions[]>,
		default: [],
	},
};

export type LtToolFunctionProps = ExtractPropTypes<typeof toolFunctionProps>;

export type LtToolFunctionParams = VxeGlobalRendererHandles.RenderButtonParams;

export type DefaultEvent = 'insert' | 'save' | 'refresh' | 'reset' | 'remove';

export interface ToolButtonOptions {
	event?: string;
	// 默认内置的行为，如果设置了默认行为则按钮可以调用内置的方法
	// 新增/ 保存，刷新，重置，删除
	default?: DefaultEvent;
	text?: string;
	preIcon?: string;
	type?: 'link' | 'default' | 'primary' | 'ghost' | 'dashed' | 'text';
	className?: string;
	visible?: ToolConfig;
	disabled?: ToolConfig;
	divider?: boolean;
	// 如果是下拉菜单
	children?: ToolMenuChildOption[];
	[key: string]: any;
}
export interface ToolMenuChildOption {
	event?: string;
	default?: DefaultEvent;
	text?: string;
	preIcon?: string;
	visible?: ToolConfig;
	disabled?: ToolConfig;
	[key: string]: any;
}
