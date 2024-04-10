import { SlotVNodeType } from 'vxe-table';
import XEUtils from 'xe-utils';
import { HelpProps } from '../../basic';
import { RenderOptions } from './render';
import {
	Align,
	FormItemTitleRenderParams,
	TitleOverflow,
	ClassNameParams,
	FormItemContentRenderParams,
} from './form-item';

export interface ItemInfo {
	id: string;
	title: string;
	field: string;
	span: string | number;
	align: Align;
	titleWidth: string | number;
	titleAlign: Align;
	titleColon: boolean;
	titleOverflow: TitleOverflow;
	vertical: boolean;
	titleHelp: Partial<HelpProps>;
	resetValue: any;

	contentClassName: string | ((params: FormItemContentRenderParams) => string);
	contentStyle:
		| Record<string, string | number>
		| ((
				params: FormItemContentRenderParams
		  ) => Record<string, string | number>);

	className: string | ((params: ClassNameParams) => string);
	titleClassName: string | ((params: FormItemTitleRenderParams) => string);
	titleStyle:
		| Record<string, string | number>
		| ((params: FormItemTitleRenderParams) => Record<string, string | number>);
	showTitle: boolean;
	visible: boolean;
	folding: boolean;
	itemRender: RenderOptions;
	collapseNode: boolean;
	showError: boolean;
	errRule: any;
	slots: {
		title?: string | (() => SlotVNodeType | SlotVNodeType[]) | null;
		default?: string | (() => SlotVNodeType | SlotVNodeType[]) | null;
	};
	children: ItemInfo[];
}

export class ItemInfo {
	constructor($ltform: any, item: any) {
		Object.assign(this, {
			id: XEUtils.uniqueId('item_'),
			title: item.title,
			field: item.field,
			span: item.span,
			align: item.align,
			resetValue: item.resetValue,
			titleWidth: item.titleWidth,
			titleAlign: item.titleAlign,
			titleColon: item.titleColon,
			vertical: item.vertical,
			titleHelp: item.titleHelp,
			titleOverflow: item.titleOverflow,
			className: item.className,
			titleClassName: item.titleClassName,
			contentClassName: item.contentClassName,
			contentStyle: item.contentStyle,
			titleStyle: item.titleStyle,
			collapseNode: item.collapseNode,
			showTitle: item.showTitle,
			itemRender: item.itemRender,
			visible: item.visible,
			folding: item.folding,
			showError: false,
			errRule: null,
			slots: item.slots,
			children: [],
		});
	}

	update(name: string, value: any) {
		this[name] = value;
	}

	[key: string]: any;
}
