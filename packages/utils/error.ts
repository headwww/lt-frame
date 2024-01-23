import { isString } from 'lodash-es';

/**
 * 自定义错误类，用于在应用中表示特定的头部错误
 */
class LTFrameError extends Error {
	constructor(m: string) {
		super(m);
		this.name = 'LTFrameError';
	}
}

/**
 * 抛出带有特定作用域和消息的头部错误
 * @param scope 错误作用域
 * @param m 错误消息
 * @throws {HeadError} 始终抛出 HeadError 类型的错误
 */
export function throwError(scope: string, m: string): never {
	throw new LTFrameError(`[${scope}] ${m}`);
}

/**
 * 在开发环境下输出调试警告信息
 * @param scope 错误作用域或 Error 对象
 * @param message 错误消息（仅在 scope 为字符串时有效）
 */
export function debugWarn(scope: string | Error, message?: string): void {
	if (process.env.NODE_ENV !== 'production') {
		const error: Error = isString(scope)
			? new LTFrameError(`[${scope}] ${message}`)
			: scope;
		// eslint-disable-next-line no-console
		console.warn(error);
	}
}
