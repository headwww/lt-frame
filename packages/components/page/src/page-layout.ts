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
		default: true,
	},
	// 固定高度使内部设置的子元素设置height为100%有效
	fixedHeight: {
		type: Boolean,
		default: true,
	},
	upwardSpace: {
		type: [String, Number] as PropType<string | number>,
		default: 0,
	},
	contentStyle: {
		type: Object as PropType<CSSProperties>,
	},
	contentBackground: {
		type: Boolean,
		default: true,
	},
};

export type PageLayoutProps = ExtractPropTypes<typeof pageLayoutProps>;

export type PageLayoutInstance = InstanceType<typeof pageLayoutVue>;
