import { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import pageLayoutVue from './page-layout.vue';

export const pageLayoutProps = {
	title: {
		type: String,
		default: '',
	},
	dense: {
		type: Boolean,
		default: false,
	},
	ghost: {
		type: Boolean,
		default: false,
	},
	content: {
		type: String,
		default: '',
	},
	contentClass: {
		type: String,
		default: '',
	},
	contentFullHeight: {
		type: Boolean,
		default: false,
	},
	fixedHeight: {
		type: Boolean,
		default: false,
	},
	upwardSpace: {
		type: [String, Number] as PropType<string | number>,
		default: 0,
	},
	contentStyle: {
		type: Object as PropType<CSSProperties>,
	},
};

export type PageLayoutProps = ExtractPropTypes<typeof pageLayoutProps>;

export type PageLayoutInstance = InstanceType<typeof pageLayoutVue>;
