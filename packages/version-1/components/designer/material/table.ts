import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import { VxeGridListeners, VxeGridProps, VxePagerProps } from 'vxe-table';

export interface EventBus {
	[key: string]: Fn<any>;
}
export interface Datasource {
	[key: string]: Fn<any>;
}

export const tableProps = {
	tUid: {
		type: String,
		required: true,
	},
	tLabel: {
		type: String,
	},
	entity: String,
	config: Object as PropType<VxeGridProps>,
	listeners: Object as PropType<VxeGridListeners>,
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
	fields: {
		type: Array as PropType<Array<string>>,
		default: () => [],
	},
	queryParams: {
		type: Object as PropType<TableQueryParams>,
	},
	/**
	 * @deprecated 废弃 后期需要优化掉，使用queryParams替代
	 */
	sql: {
		type: String,
	},
};

export type TableQueryParams = {
	expression?: string;
	params?: Array<{
		type: string;
		value: number | undefined;
	}>;
};
export type TableProps = ExtractPropTypes<typeof tableProps>;
