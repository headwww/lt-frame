import { ExtractPropTypes } from 'vue';
import SvgIcon from './svg-icon.vue';

export const svgIconProps = {
	prefix: {
		type: String,
		default: 'icon',
	},
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		default: '',
	},
	size: {
		type: [Number, String],
		default: 16,
	},
	spin: {
		type: Boolean,
		default: false,
	},
};

export type SvgIconProps = ExtractPropTypes<typeof svgIconProps>;

export type SvgIconInstance = InstanceType<typeof SvgIcon>;
