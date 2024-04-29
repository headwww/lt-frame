import { useMessage } from '@lt-frame/hooks';
import { ErrorMessageMode } from '@lt-frame/utils';

const { createMessage, createErrorModal, notification } = useMessage();
export function checkStatus(
	status: number,
	msg: string,
	errorMessageMode: ErrorMessageMode = 'message'
): void {
	let errMessage = '';

	switch (status) {
		// case 400:
		// 	errMessage = `${msg}`;
		// break;
		case 401:
			errMessage = '用户登录失效！';
			break;
		case 404:
			errMessage = '网络请求错误，未找到该资源！';
			break;
		// case 531:
		// 	errMessage = `${msg}`;
		// 	break;
		// case 600:
		// 	errMessage = `${msg}`;
		// 	break;
		// case 500:
		// 	errMessage = `${msg}`;
		// 	break;
		default:
			errMessage = `${msg}`;
			break;
	}
	if (errMessage) {
		if (errorMessageMode === 'modal') {
			createErrorModal({ title: '错误提示', content: errMessage });
		} else if (errorMessageMode === 'message') {
			createMessage.error(errMessage);
		} else if (errorMessageMode === 'notification') {
			notification.error({
				message: '请求失败',
				description: errMessage,
			});
		}
	}
}
