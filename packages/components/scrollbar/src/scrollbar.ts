import { definePropType, isNumber } from '@lt-frame/utils';
import { ExtractPropTypes, StyleValue } from 'vue';
import type Scrollbar from './scrollbar.vue';

export const scrollbarProps = {
	height: {
		type: [String, Number],
		default: '',
	},
	maxHeight: {
		type: [String, Number],
		default: '',
	},
	native: {
		type: Boolean,
		default: false,
	},
	wrapClass: {
		type: [String, Array],
		default: '',
	},

	wrapStyle: {
		type: definePropType<StyleValue>([String, Object, Array]),
		default: '',
	},
	viewClass: {
		type: [String, Array],
		default: '',
	},
	viewStyle: {
		type: [String, Array, Object],
		default: '',
	},
	tag: {
		type: String,
		default: 'div',
	},
	id: String,
	minSize: {
		type: Number,
		default: 20,
	},
	always: Boolean,
	noresize: Boolean,
	role: String,
	ariaLabel: String,
	ariaOrientation: {
		type: String,
		values: ['horizontal', 'vertical'],
	},
	scrollAnimationOff: {
		type: Boolean,
		values: false,
	},
};
export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>;

export const scrollbarEmits = {
	scroll: ({
		scrollTop,
		scrollLeft,
	}: {
		scrollTop: number;
		scrollLeft: number;
	}) => [scrollTop, scrollLeft].every(isNumber),
};
export type ScrollbarEmits = typeof scrollbarEmits;
export type ScrollbarInstance = InstanceType<typeof Scrollbar>;
