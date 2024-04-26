import type { CSSProperties, InjectionKey } from 'vue';
import { Fn } from '@lt-frame/utils';
import { Pane } from './pane';

export interface SplitpanesMethods {
	onPaneAdd: (pane: Pane) => void;
	onPaneRemove: (pane: Pane) => void;
	onPaneClick: (event: Event, id?: number) => void;
	requestUpdate: (arg0: RequestUpdateType) => void;
}

export const splitpanesKey: InjectionKey<SplitpanesMethods> =
	Symbol('splitpanesMethods');

// 移除的Pane
export interface RemovedPaneType {
	[key: number]: Pane;
	index: number;
}

export interface CoordinateType {
	x: number;
	y: number;
}

export interface ChangedPaneType {
	addedPane?: SplitpaneIndexedElementType;
	removedPane?: RemovedPaneType;
}

export interface SumsType {
	prevPanesSize: number;
	nextPanesSize: number;
	prevReachedMinPanes: number;
	nextReachedMinPanes: number;
}

export interface RequestUpdateType {
	target: Pane;
	min?: number | undefined;
	max?: number | undefined;
	size?: number | undefined;
}

export interface SplitpaneIndexedElementType {
	id: number;
	index: number;
	max: number;
	min: number;
	size: number;
	givenSize: number | null;
	update: Fn<CSSProperties, void>;
	// [key: number]: SplitpaneIndexedElementType;
}

export interface SplitpaneIndexedType {
	[key: number]: SplitpaneIndexedElementType;
}

export const splitPanesProps = {
	horizontal: Boolean,
	firstSplitter: Boolean,
	dblClickSplitter: { type: Boolean, default: true },
	pushOtherPanes: { type: Boolean, default: true },
	rtl: { type: Boolean, default: false },
};
