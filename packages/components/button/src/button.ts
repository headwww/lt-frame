import { ExtractPropTypes, PropType } from 'vue';
import Button from './button.vue';

const validColors = ['primary', 'error', 'warning', 'success', ''] as const;
type ButtonColorType = (typeof validColors)[number];

export const buttonProps = {
	color: {
		type: String as PropType<ButtonColorType>,
		validator: (v: any) => validColors.includes(v),
		default: '',
	},
	loading: { type: Boolean },
	disabled: { type: Boolean },
	preIcon: { type: String },
	postIcon: { type: String },
	iconSize: { type: Number, default: 14 },
	onClick: {
		type: [Function, Array] as PropType<(() => any) | (() => any)[]>,
		default: null,
	},
};

export type ButtonProps = ExtractPropTypes<typeof buttonProps>;

export type ButtonInstance = InstanceType<typeof Button>;
