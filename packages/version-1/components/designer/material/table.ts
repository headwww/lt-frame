import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import {
	VxeGridInstance,
	VxeGridListeners,
	VxeGridProps,
	VxePagerProps,
} from 'vxe-table';

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
	tableInstance: {
		type: Object as PropType<VxeGridInstance>,
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
	// 表达式
	expression?: string;
	/**
	 * 参数 目前仅仅考虑日期类型，其他的类型的值直接写在expression中 ，
	 * [{type: 'date', value: 1732352905561}] params数量和expression中的?占位符数量一致
	 */
	params?: Array<{
		// 参数类型
		type: string;
		// 参数值
		value: number | undefined;
	}>;
};

export type TableProps = ExtractPropTypes<typeof tableProps>;
