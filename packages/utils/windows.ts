type TargetContext = '_self' | '_blank';

/**
 * 打开新窗口函数
 * @param url 新窗口的 URL 地址
 * @param opt 打开新窗口的选项
 */
export function openWindow(
	url: string,
	opt?: {
		// 目标窗口的名称或上下文
		target?: TargetContext | string;
		// 是否使用 noopener 属性，防止新打开的窗口访问 window.opener
		noopener?: boolean;
		// 是否使用 noreferrer 属性，防止新打开的窗口传递 referrer 信息
		noreferrer?: boolean;
	}
) {
	const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
	const feature: string[] = [];
	noopener && feature.push('noopener=yes');
	noreferrer && feature.push('noreferrer=yes');
	window.open(url, target, feature.join(','));
}
