import { ExtractPropTypes } from 'vue';
import modalWrapperVue from './modal-wrapper.vue';

export const modalWrapperProps = {
	loading: { type: Boolean },
	loadingTip: { type: String },
	fullScreen: { type: Boolean },
	minHeight: { type: Number, default: 0 },
	open: { type: Boolean },
	modalHeaderHeight: { type: Number, default: 57 },
	modalFooterHeight: { type: Number, default: 74 },
	footerOffset: { type: Number, default: 0 },
	isSubTitle: { type: Boolean },
	height: { type: Number },
};

export type ModalWrapperProps = ExtractPropTypes<typeof modalWrapperProps>;

export type ModalWrapperInstance = InstanceType<typeof modalWrapperVue>;
