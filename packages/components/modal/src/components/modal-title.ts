import { ExtractPropTypes } from 'vue';
import modalTitleVue from './modal-title.vue';

export const modalTitleProps = {
	title: { type: String },
	subTitle: { type: String },
	tip: { type: String },
	draggable: { type: Boolean, default: true },
};

export type ModalTitleProps = ExtractPropTypes<typeof modalTitleProps>;

export type ModalTitleInstance = InstanceType<typeof modalTitleVue>;
