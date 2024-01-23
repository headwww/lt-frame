import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { Modal, message as Message, notification } from 'ant-design-vue';
import {
	InfoCircleFilled,
	CheckCircleFilled,
	CloseCircleFilled,
} from '@ant-design/icons-vue';
import {
	NotificationArgsProps,
	ConfigProps,
} from 'ant-design-vue/lib/notification';
import { isString } from 'lodash-es';

export interface NotifyApi {
	info(config: NotificationArgsProps): void;
	success(config: NotificationArgsProps): void;
	error(config: NotificationArgsProps): void;
	warn(config: NotificationArgsProps): void;
	warning(config: NotificationArgsProps): void;
	open(args: NotificationArgsProps): void;
	close(key: String): void;
	config(options: ConfigProps): void;
	destroy(): void;
}

export declare type NotificationPlacement =
	| 'topLeft'
	| 'topRight'
	| 'bottomLeft'
	| 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
	iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> &
	Pick<ModalOptionsEx, 'content'>;

interface ConfirmOptions {
	info: ModalFunc;
	success: ModalFunc;
	error: ModalFunc;
	warn: ModalFunc;
	warning: ModalFunc;
}

function getIcon(iconType: string) {
	if (iconType === 'warning') {
		return <InfoCircleFilled class="modal-icon-warning" />;
	}
	if (iconType === 'success') {
		return <CheckCircleFilled class="modal-icon-success" />;
	}
	if (iconType === 'info') {
		return <InfoCircleFilled class="modal-icon-info" />;
	}
	return <CloseCircleFilled class="modal-icon-error" />;
}

function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
	if (isString(content)) {
		return <div innerHTML={`<div>${content as string}</div>`}></div>;
	}
	return content;
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
	const iconType = options.iconType || 'warning';
	Reflect.deleteProperty(options, 'iconType');
	const opt: ModalFuncProps = {
		centered: true,
		icon: getIcon(iconType),
		...options,
		content: renderContent(options),
	};
	return Modal.confirm(opt) as unknown as ConfirmOptions;
}

const getBaseOptions = () => ({
	okText: '确认',
	centered: true,
});

function createModalOptions(
	options: ModalOptionsPartial,
	icon: string
): ModalOptionsPartial {
	return {
		...getBaseOptions(),
		...options,
		content: renderContent(options),
		icon: getIcon(icon),
	};
}

function createSuccessModal(options: ModalOptionsPartial) {
	return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
	return Modal.error(createModalOptions(options, 'error'));
}

function createInfoModal(options: ModalOptionsPartial) {
	return Modal.info(createModalOptions(options, 'info'));
}

function createWarningModal(options: ModalOptionsPartial) {
	return Modal.warning(createModalOptions(options, 'warning'));
}

notification.config({
	placement: 'topRight',
	duration: 3,
});

/**
 * @description: message
 */
export function useMessage(): {
	createMessage: typeof Message;
	notification: NotifyApi;
	createConfirm: (options: ModalOptionsEx) => ConfirmOptions;
	createSuccessModal: (
		options: ModalOptionsPartial
	) => ReturnType<typeof Modal.success>;
	createErrorModal: (
		options: ModalOptionsPartial
	) => ReturnType<typeof Modal.error>;
	createInfoModal: (
		options: ModalOptionsPartial
	) => ReturnType<typeof Modal.info>;
	createWarningModal: (
		options: ModalOptionsPartial
	) => ReturnType<typeof Modal.warning>;
} {
	return {
		createMessage: Message,
		notification: notification as NotifyApi,
		createConfirm,
		createSuccessModal,
		createErrorModal,
		createInfoModal,
		createWarningModal,
	};
}
