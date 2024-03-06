import { isNull, isUndefined } from 'lodash-es';
import { AesEncryption, EncryptionParams } from './cipher';
/**
 * 缓存对象所需的参数接口
 */
export interface CreateStorageParams extends EncryptionParams {
	// 缓存键的前缀
	prefixKey: string;
	// 存储引擎，可以是sessionStorage或localStorage
	storage: Storage;
	// 是否开启加密
	hasEncrypt: boolean;
	// 缓存过期时间（可选）
	timeout: number;
}

/**
 * 创建缓存对象的函数
 */
export const createStorage = ({
	prefixKey = '',
	storage = sessionStorage,
	key = 'langtongkeji',
	iv = 'ltscm',
	timeout,
	hasEncrypt = true,
}: Partial<CreateStorageParams> = {}) => {
	// 如果开启了加密，并且密钥或初始化向量的长度不是16位，抛出错误
	if (hasEncrypt && [key.length, iv.length].some((item) => item !== 16)) {
		throw new Error('When hasEncrypt is true, the key or iv must be 16 bits!');
	}

	// 创建AES加密实例
	const encryption = new AesEncryption({ key, iv });

	/**
	 * 缓存对象类
	 * 构造函数参数可以传入sessionStorage或localStorage等存储引擎
	 * @class Cache
	 * @example
	 */
	const WebStorage = class WebStorage {
		storage: Storage;

		prefixKey?: string;

		encryption: AesEncryption;

		hasEncrypt: boolean;

		constructor() {
			this.storage = storage;
			this.prefixKey = prefixKey;
			this.encryption = encryption;
			this.hasEncrypt = hasEncrypt;
		}

		// 获取带前缀的缓存键
		getKey(key: string) {
			return `${this.prefixKey}${key}`.toUpperCase();
		}

		/**
		 * 设置缓存
		 * @param {string} key 缓存键
		 * @param {*} value 缓存值
		 * @param {*} expire 过期时间（秒）
		 */
		set(key: string, value: any, expire = timeout) {
			// 序列化缓存数据，包括值、时间戳、过期时间
			const stringData = JSON.stringify({
				value,
				time: Date.now(),
				expire: !(isNull(expire) || isUndefined(expire))
					? new Date().getTime() + expire * 1000
					: null,
			});
			// 如果开启了加密，使用AES加密数据，否则直接存储
			const stringifyValue = this.hasEncrypt
				? this.encryption.encryptByAES(stringData)
				: stringData;
			this.storage.setItem(this.getKey(key), stringifyValue);
		}

		/**
		 * 读取缓存
		 * @param {string} key 缓存键
		 * @param {*} def 默认值
		 */
		get(key: string, def: any = null): any {
			const val = this.storage.getItem(this.getKey(key));
			if (!val) return def;

			try {
				// 如果开启了加密，解密缓存数据，然后解析成对象
				const decVal = this.hasEncrypt
					? this.encryption.decryptByAES(val)
					: val;
				const data = JSON.parse(decVal);
				const { value, expire } = data;
				// 如果缓存未过期，返回缓存值，否则删除缓存
				if (
					isNull(expire) ||
					isUndefined(expire) ||
					expire >= new Date().getTime()
				) {
					return value;
				}
				this.remove(key);
			} catch (e) {
				return def;
			}
			return def;
		}

		/**
		 * 根据键删除缓存
		 * @param {string} key 缓存键
		 */
		remove(key: string) {
			this.storage.removeItem(this.getKey(key));
		}

		/**
		 * 清空所有缓存
		 */
		clear(): void {
			this.storage.clear();
		}
	};

	return new WebStorage();
};
