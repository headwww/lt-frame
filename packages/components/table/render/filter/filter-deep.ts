import { ExtractPropTypes, PropType } from 'vue';
import { VxeColumnProps, VxeGlobalRendererHandles } from 'vxe-table';
import {
	InputNumberProps,
	InputProps,
	DatePickerProps,
	TreeProps,
} from 'ant-design-vue';
import {
	ContentFilterConfig,
	EntityFilterConfig,
	FilterConfig,
	FilterMode,
} from './types';
import { LTTableProps } from '../../src/table';

export interface EntityConfig {
	// 如果是实体筛选需要配置筛选的字段
	compareField?: String;
	// 设置表格的数据源 请求的方式
	tableDatePromise?: () => Promise<any>;
	// 设置表格数据源 数组的方式，tableDatePromise权重高一些
	tableDate?: Array<any>;
	// 配置table的字段
	colConfigs?: VxeColumnProps[];
}

export const filterDeepProps = {
	params: Object as PropType<VxeGlobalRendererHandles.RenderFilterParams>,
	// 开启的筛选的模式
	filterModes: Array<FilterMode>,
	// 实体筛选需要提供的配置
	entityConfig: Object as PropType<EntityConfig>,
};

export type FilterDeepProps = ExtractPropTypes<typeof filterDeepProps>;

export interface FilterDeepAttrs {
	textAttrs?: InputProps;
	numberAttrs?: InputNumberProps;
	dateAttrs?: DatePickerProps;
	contentAttrs?: TreeProps;
	entityAttrs?: {
		tableAttrs: Omit<LTTableProps, 'colConfigs' | 'data'>;
		inputAttrs: InputProps;
	};
}

/**
 * 配置筛选的条件
 */
export interface FilterDeepRef {
	currentFilterMode: FilterMode;
	textFilterConfig?: FilterConfig;
	numberFilterConfig?: FilterConfig;
	contentFilterConfig?: ContentFilterConfig;
	dateFilterConfig?: FilterConfig;
	entityFilterConfig?: EntityFilterConfig;
}
