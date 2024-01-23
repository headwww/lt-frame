/**
 * 请求报错时的提示方式
 */
export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

/**
 * 请求成功时的提示方式
 */
export type SuccessMessageMode = ErrorMessageMode;

/**
 * 请求重试
 */
export interface RetryRequest {
	// 是否开启请求重试
	isOpenRetry: boolean;
	// 重试次数
	count: number;
	// 重试等待时间
	waitTime: number;
}

/**
 * 请求参数配置
 */
export interface RequestOptions {
	// 是否处理请求结果
	isTransformResponse?: boolean;
	// 是否返回原生响应头
	// 例如：在需要获取响应头时使用该属性
	isReturnNativeResponse?: boolean;
	// 错误消息提示类型
	errorMessageMode?: ErrorMessageMode;
	// 成功消息提示类型
	successMessageMode?: SuccessMessageMode;
	//  忽略重复请求
	ignoreCancelToken?: boolean;
	// 请求重试机制配置
	retryRequest?: RetryRequest;
}

/**
 * 统一返回格式
 */
export interface Result<T = any> {
	// 响应码
	code: number;
	// 响应类型，可以是'success'、'error'或'warning'
	type: 'success' | 'error' | 'warning';
	// 响应消息
	message: string;
	// 响应数据
	result: T;
}
