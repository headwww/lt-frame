import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import { VxeGridProps, VxePagerProps } from 'vxe-table';

export interface EventBus {
	[key: string]: Fn;
}
export interface Datasource {
	[key: string]: Fn;
}

export const tableProps = {
	tUid: {
		type: String,
		required: true,
	},
	entity: String,
	config: Object as PropType<VxeGridProps>,
	eventBus: {
		type: Object as PropType<EventBus>,
		default: () => ({}),
	},
	datasource: {
		type: Object as PropType<Datasource>,
		default: () => ({}),
	},
	pager: {
		type: Object as PropType<VxePagerProps>,
	},
};
export type TableProps = ExtractPropTypes<typeof tableProps>;
