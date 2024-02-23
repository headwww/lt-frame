import { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import { VueNode } from 'ant-design-vue/es/_util/type';
import { modalTitleProps } from './modal-title';
import { modalColseProps } from './modal-close';
import { modalFooterProps } from './modal-footer';
import { ModalWrapperProps } from './modal-wrapper';

export const modalProps = {
	open: { type: Boolean },
	centered: { type: Boolean, default: true },
	maskClosable: { type: Boolean, default: true },
	loading: { type: Boolean },
	loadingTip: { type: String },
	minHeight: { type: Number },
	height: { type: Number },
	scrollTop: { type: Boolean, default: true },
	wrapperProps: Object as PropType<Partial<ModalWrapperProps>>,
	afterClose: Function as PropType<() => Promise<VueNode>>,
	bodyStyle: Object as PropType<CSSProperties>,
	destroyOnClose: { type: Boolean },
	getContainer: Function as PropType<() => any>,
	mask: { type: Boolean, default: true },
	keyboard: { type: Boolean, default: true },
	maskStyle: Object as PropType<CSSProperties>,
	width: [String, Number] as PropType<string | number>,
	wrapClassName: { type: String },
	zIndex: { type: Number },
};

export const basicProps = {
	...modalTitleProps,
	...modalColseProps,
	...modalProps,
	...modalFooterProps,
};

export type BaseModalProps = ExtractPropTypes<typeof basicProps>;
