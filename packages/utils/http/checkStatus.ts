// import { useMessage } from '@/hooks/web/useMessage'

import { useMessage } from '@lt-frame/hooks/use-message';
import { ErrorMessageMode } from './types';

const { createMessage, createErrorModal } = useMessage();
export function checkStatus(
	status: number,
	msg: string,
	errorMessageMode: ErrorMessageMode = 'message'
): void {
	let errMessage = '';
	switch (status) {
		case 401:
			errMessage = '用户登录失效！';
			break;
		case 404:
			errMessage = '网络请求错误，未找到该资源！';
			break;
		case 531:
			errMessage = `${msg}`;
			break;
		default:
	}
	if (errMessage) {
		if (errorMessageMode === 'modal') {
			createErrorModal({ title: '错误提示', content: errMessage });
		} else if (errorMessageMode === 'message') {
			createMessage.error(errMessage);
		}
	}
}
