import { clone } from 'lodash-es';
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import { useMessage } from '@lt-frame/hooks';
import {
	AxiosRetry,
	AxiosTransform,
	ContentTypeEnum,
	CreateAxiosOptions,
	LTAxios,
	RequestEnum,
	RequestOptions,
	Result,
	checkStatus,
	deepMerge,
} from '@lt-frame/utils';

const { createMessage, createErrorModal } = useMessage();

const transform: AxiosTransform = {
	transformResponseHook: (
		res: AxiosResponse<Result>,
		options: RequestOptions
	) => {
		const { isTransformResponse, isReturnNativeResponse } = options;
		// 是否返回原生响应头
		if (isReturnNativeResponse) {
			return res;
		}
		// 提取出data
		if (!isTransformResponse) {
			return res.data;
		}
		// 本项目后端接口没有做统一返回处理，所以无法做下面的操作，
		// 因为所有的报错全部被后端通过try-catch出去了所以只会走responseInterceptorsCatch

		return res.data;
	},

	beforeRequestHook: (config) => config,

	requestInterceptors: (config) => config,

	responseInterceptors: (res: AxiosResponse<any>) => res,

	responseInterceptorsCatch(axiosInstance: AxiosInstance, error: any) {
		const { response, code, config, message } = error || {};
		const msg: string = response?.data?.errorText ?? '';
		const err: string = error?.toString?.() ?? '';
		const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';

		let errMessage;

		if (axios.isCancel(error)) {
			return Promise.reject(error);
		}

		try {
			if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
				errMessage = '接口请求超时，请刷新页面重试！';
			}
			if (err?.includes('Network Error')) {
				errMessage = '网络异常，请检查网络后重试！';
			}
			if (errMessage) {
				if (errorMessageMode === 'modal') {
					createErrorModal({ title: '错误提示', content: errMessage });
				} else if (errorMessageMode === 'message') {
					createMessage.error(errMessage);
				}
				return Promise.reject(error);
			}
		} catch (error) {
			throw new Error(error as unknown as string);
		}

		checkStatus(error?.response?.status, msg, errorMessageMode);

		// 添加自动重试机制 保险起见 只针对GET请求
		const retryRequest = new AxiosRetry();
		const { isOpenRetry } = config.requestOptions.retryRequest;
		config.method?.toUpperCase() === RequestEnum.GET &&
			isOpenRetry &&
			retryRequest.retry(axiosInstance, error);
		return Promise.reject(error);
	},
};

function defineHttp(opt?: Partial<CreateAxiosOptions>): LTAxios {
	return new LTAxios(
		deepMerge(
			// 默认请求配置
			{
				// 基础请求地址
				baseURL: '/ltApi',
				// 配置公共请求头
				Headers: {
					'Content-Type': ContentTypeEnum.JSON,
					Accept: 'application/json',
				},
				// 请求超时时常
				timeout: 60 * 1000,
				// 数据转换
				transform: clone(transform),
				requestOptions: {
					// 忽略重复请求
					ignoreCancelToken: true,
					// 是否返回原生响应头 比如：需要获取响应头时使用该属性
					isReturnNativeResponse: false,
					// 需要对返回数据进行处理
					isTransformResponse: false,
					// 消息提示类型
					errorMessageMode: 'message',
					retryRequest: {
						// 请求重试机制配置
						isOpenRetry: false,
						// 重试次数
						count: 5,
						// 重试等待时间
						waitTime: 100,
					},
				},
			},
			opt || {}
		)
	);
}

export default defineHttp;
