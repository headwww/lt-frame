import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';

export const toolFunctionProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderButtonParams>,
};
export type ToolFunctionProps = ExtractPropTypes<typeof toolFunctionProps>;
