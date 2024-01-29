import { ExtractPropTypes, PropType } from 'vue';
import Icon from './icon.vue';

export const iconProps = {
	icon: {
		type: String,
		default: '',
	},
	color: {
		type: String,
		default: '',
	},
	size: {
		type: [String, Number] as PropType<string | number>,
		default: 16,
	},
	spin: {
		type: Boolean,
		default: false,
	},
};

export type IconProps = ExtractPropTypes<typeof iconProps>;

export type IconInstance = InstanceType<typeof Icon>;
