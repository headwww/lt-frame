import { ExtractPropTypes, PropType } from 'vue';
import { VueNode } from 'ant-design-vue/es/_util/type';
import modalCloseVue from './modal-close.vue';

export const modalColseProps = {
	canFullscreen: { type: Boolean, default: true },
	fullScreen: { type: Boolean },
	defaultFullscreen: { type: Boolean },
	closeFunc: Function as PropType<() => Promise<boolean>>,
	closable: { type: Boolean, default: true },
	closeIcon: Object as PropType<VueNode>,
};

export type ModalColseProps = ExtractPropTypes<typeof modalColseProps>;

export type ModalColseInstance = InstanceType<typeof modalCloseVue>;
