import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';
import { ButtonType } from 'ant-design-vue/es/button';
import { ButtonProps } from '../../../../button';

export interface ToolBusinessOptions extends ButtonProps {
	event: string | number;
	type?: ButtonType;
	text?: string;
}

export const toolBusinessProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderToolParams>,
	options: {
		type: Object as PropType<ToolBusinessOptions[]>,
		default: () => [],
	},
};
export type ToolBusinessProps = ExtractPropTypes<typeof toolBusinessProps>;
