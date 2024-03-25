import { message } from 'ant-design-vue';

/**
 * 复制文本到剪切板的工具函数
 * @param text 要复制的文本
 * @param prompt 复制成功后的提示消息，可选，默认为 '已成功复制到剪切板!'
 */
export function copyText(
	text: string,
	prompt: string | null = '已成功复制到剪切板!'
) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(
			() => {
				prompt && message.success(prompt);
			},
			(error: Error) => {
				message.error(`复制失败!${error.message}`);
			}
		);
	} else {
		message.error('你的浏览器不支持剪贴板操作');
	}
}
