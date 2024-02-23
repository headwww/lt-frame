import { ComputedRef } from 'vue';
import { BaseModalProps } from './components/base-modal';

/**
 * 对外暴露modal的一些方法
 */
export interface ModalMethods {
	// 设置modal的属性
	setModalProps: (props: Partial<BaseModalProps>) => void;
	// 更新Open状态
	emitOpen?: (open: boolean, uid: number) => void;
	// 重置modal的height
	redoModalHeight?: () => void;
}

export type ModalRegisterFn = (
	modalMethods: ModalMethods,
	uuid: number
) => void;

export interface ModalReturnMethods extends ModalMethods {
	// 打开modal
	openModal: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
	// 关闭modal
	closeModal: () => void;
	// modal的打开/关闭状态
	getOpen?: ComputedRef<boolean>;
}

export type UseModalReturnType = [ModalRegisterFn, ModalReturnMethods];

export interface ReturnInnerMethods extends ModalMethods {
	closeModal: () => void;
	changeLoading: (loading: boolean) => void;
	changeOkLoading: (loading: boolean) => void;
	getOpen?: ComputedRef<boolean>;
	redoModalHeight: () => void;
}

export type UseModalInnerReturnType = [ModalRegisterFn, ReturnInnerMethods];
