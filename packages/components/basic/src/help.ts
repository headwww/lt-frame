import { ExtractPropTypes, PropType } from 'vue';

export const helpProps = {
	/**
	 * 最大宽度，默认600px
	 */
	maxWidth: { type: String, default: '600px' },
	/**
	 * 是否显示序列号
	 */
	showIndex: { type: Boolean },

	/**
	 * 文本颜色
	 */
	color: { type: String, default: '#ffffff' },
	/**
	 * 文本大小
	 */
	fontSize: { type: String, default: '14px' },
	/**
	 * Tooltip的位置
	 */
	placement: { type: String, default: 'right' },

	/**
	 * 文本
	 */
	text: { type: [Array, String] as PropType<string[] | string> },
};

export type HelpProps = ExtractPropTypes<typeof helpProps>;
