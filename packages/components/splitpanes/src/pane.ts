import { Fn } from '@lt-frame/utils';
import { CSSProperties } from 'vue';

export interface Pane {
	uid?: number;
	el?: HTMLDivElement;
	minSize: number | string;
	maxSize: number | string;
	size: number | string;
	update: Fn<CSSProperties, void>;
}

export const paneProps = {
	minSize: {
		type: [Number, String],
		default: 0,
	},
	maxSize: {
		type: [Number, String],
		default: 100,
	},
	size: {
		type: [Number, String],
		default: null,
	},
};
