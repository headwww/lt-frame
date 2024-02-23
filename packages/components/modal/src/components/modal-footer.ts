import { ExtractPropTypes, PropType, VNodeChild } from 'vue';
import { ButtonProps } from '../../../button';
import modalFooterVue from './modal-footer.vue';

/**
 * 自定义底部
 */
export const modalFooterProps = {
	// 取消按钮文本默认为取消
	cancelText: { type: String, default: '取消' },
	// 确认按钮文本默认为确认
	okText: { type: String, default: '确认' },
	// 确认按钮的类型
	okType: { type: String, default: 'primary' },
	// 显示取消按钮
	showCancelBtn: { type: Boolean, default: true },
	// 显示确认按钮
	showOkBtn: { type: Boolean, default: true },
	// 确定按钮样式
	okButtonProps: Object as PropType<ButtonProps>,
	// 取消按钮样式
	cancelButtonProps: Object as PropType<ButtonProps>,
	// 增加底部的高度
	wrapperFooterOffset: { type: Number, default: 0 },
	// 自定义底部
	footer: Object as PropType<VNodeChild | JSX.Element>,
	// 确定按钮 loading
	confirmLoading: { type: Boolean },
};

export type ModalFooterProps = ExtractPropTypes<typeof modalFooterProps>;

export type ModalFooterInstance = InstanceType<typeof modalFooterVue>;
