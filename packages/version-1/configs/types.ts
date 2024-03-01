export interface CipherKV {
	key: string;
	iv: string;
}

export interface Cache {
	// 缓存加密的密钥
	cipher?: CipherKV;
	// 缓存过期的时间
	defaultCacheTime?: number;
	// 是否加密
	enableStorageEncryption?: boolean;
}

export interface ProjectConfig {
	// 缓存配置
	cache?: Cache;
	// 切换路由时是否取消未处理的请求
	removeAllHttpPending?: boolean;
	// 切换接口时是否删除未关闭的消息和通知
	closeMessageOnSwitch?: boolean;
}
