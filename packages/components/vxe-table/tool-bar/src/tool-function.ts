import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';

type ToolDisabledConfig =
	| boolean
	| Fn<VxeGlobalRendererHandles.RenderButtonParams, boolean>;

export const toolFunctionProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderButtonParams>,
	insert: [Object, Boolean] as PropType<ToolDisabledConfig>,
	save: [Object, Boolean] as PropType<ToolDisabledConfig>,
	remove: [Object, Boolean] as PropType<ToolDisabledConfig>,
	refresh: [Object, Boolean] as PropType<ToolDisabledConfig>,
	reset: [Object, Boolean] as PropType<ToolDisabledConfig>,
};
export type ToolFunctionProps = ExtractPropTypes<typeof toolFunctionProps>;

export type LtToolFunctionParams = VxeGlobalRendererHandles.RenderButtonParams;
