import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
import { ButtonType } from 'ant-design-vue/es/button';
import { Fn } from '@lt-frame/utils';
import { ButtonProps } from '../../../button';

export interface ToolBusinessOptions extends Omit<ButtonProps, 'disabled'> {
	event: string | number;
	type?: ButtonType;
	text?: string;
	disabled?: boolean | Fn<VxeGlobalRendererHandles.RenderToolParams, boolean>;
}

export const toolBusinessProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderToolParams>,
	options: {
		type: Object as PropType<ToolBusinessOptions[]>,
		default: () => [],
	},
};

export type LtToolBusinessProps = ExtractPropTypes<typeof toolBusinessProps>;
