import { PropType, CSSProperties, VNode } from 'vue';
import { DescriptionsProps } from 'ant-design-vue';
import description from './description.vue';

export interface DescItem {
	field: string;
	label: string | VNode | JSX.Element;
	span?: number;
	labelMinWidth?: number;
	contentMinWidth?: number;
	labelStyle?: CSSProperties;
	fieldStyle?: CSSProperties;
	isCopyEnabled?: boolean;
	isTip?: boolean;
	tip?: string;
	show?: (...arg: any) => boolean;
	render?: (
		val: any,
		data: Record<string, any>
	) => VNode | undefined | JSX.Element | Element | string | number;
}

export interface DescInstance {
	setDescProps(descProps: Partial<DescriptionProps>): void;
}

export type Register = (descInstance: DescInstance) => void;

export type UseDescReturnType = [Register, DescInstance];

export const descriptionProps = {
	schema: {
		type: Array as PropType<DescItem[]>,
		default: () => [],
	},
	data: { type: Object },
	title: { type: String, default: '' },
	size: {
		type: String,
		validator: (v: string | undefined) =>
			['small', 'default', 'middle', undefined].includes(v),
		default: 'small',
	},
	bordered: { type: Boolean, default: false },
	column: {
		type: [Number, Object],
		default: () => ({ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }),
	},
};

export interface DescriptionProps extends DescriptionsProps {
	schema: DescItem[];
	data: Record<string, any>;
}

export type DescriptionInstance = InstanceType<typeof description>;
