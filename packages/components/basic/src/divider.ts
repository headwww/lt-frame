import { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { HelpProps } from './help';

export const dividerProps = {
	title: {
		type: String,
		default: '',
	},

	strip: {
		type: Boolean,
		default: true,
	},
	stripStyle: {
		type: Object as PropType<CSSProperties>,
	},

	helpProps: {
		type: Object as PropType<HelpProps>,
	},
};

export type DividerProps = ExtractPropTypes<typeof dividerProps>;
