/**
 * 定义缓存对象的结构接口
 */
export interface Cache<V = any> {
	// 缓存的值
	value?: V;
	// 定时器 ID，用于过期时清除缓存
	timeoutId?: ReturnType<typeof setTimeout>;
	// 缓存的时间戳
	time?: number;
	// 缓存的存活时间
	alive?: number;
}

// 默认存活时间为 0，表示缓存不会自动过期
const NOT_ALIVE = 0;

/**
 * 内存缓存类
 */
export class Memory<T = any, V = any> {
	// 缓存对象，使用泛型 T 作为键的集合
	private cache: { [key in keyof T]?: Cache<V> } = {};

	// 默认存活时间
	private alive: number;

	constructor(alive = NOT_ALIVE) {
		// 存活时间单位为秒
		this.alive = alive * 1000; // 转换为毫秒
	}

	// 获取整个缓存对象
	get getCache() {
		return this.cache;
	}

	// 设置整个缓存对象
	setCache(cache: { [key in keyof T]?: Cache<V> }) {
		this.cache = cache;
	}

	// 获取指定键的缓存值
	get<K extends keyof T>(key: K) {
		return this.cache[key];
	}

	// 设置指定键的缓存值
	set<K extends keyof T>(key: K, value: V, expires?: number) {
		let item = this.get(key);

		if (!expires || (expires as number) <= 0) {
			// 使用默认存活时间
			expires = this.alive;
		}
		if (item) {
			if (item.timeoutId) {
				// 清除之前的定时器
				clearTimeout(item.timeoutId);
				item.timeoutId = undefined;
			}
			// 更新缓存值
			item.value = value;
		} else {
			// 创建新的缓存项
			item = { value, alive: expires };
			this.cache[key] = item;
		}

		if (!expires) {
			return value;
		}
		const now = new Date().getTime();
		/**
		 * 防止 setTimeout 最大延迟值溢出
		 * 最大延迟值为 2,147,483,647 毫秒
		 * 参考：https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#maximum_delay_value
		 */
		item.time = expires > now ? expires : now + expires;
		item.timeoutId = setTimeout(
			() => {
				// 缓存过期后，自动移除
				key && this.remove(key);
			},
			expires > now ? expires - now : expires
		);
		return value;
	}

	/**
	 * 移除指定键的缓存值
	 * @param key
	 * @returns
	 */
	remove<K extends keyof T>(key: K) {
		const item = this.get(key);
		// 从缓存对象中删除
		Reflect.deleteProperty(this.cache, key);
		if (item) {
			// 清除定时器
			clearTimeout(item.timeoutId!);
			return item.value;
		}
		return undefined;
	}

	/**
	 * 重置缓存为指定的键值对集合
	 * @param cache
	 */
	resetCache(cache: { [K in keyof T]: Cache }) {
		Object.keys(cache).forEach((key) => {
			const k = key as any as keyof T;
			const item = cache[k];
			if (item && item.time) {
				const now = new Date().getTime();
				const expire = item.time;
				if (expire > now) {
					// 重新设置缓存项
					this.set(k, item.value, expire);
				}
			}
		});
	}

	/**
	 * 清空整个缓存对象，包括清除所有定时器
	 */

	clear() {
		// 使用索引签名告诉 TypeScript key 是有效的属性名称
		Object.keys(this.cache).forEach((key) => {
			const item = this.cache[key as keyof T];
			item?.timeoutId && clearTimeout(item.timeoutId);
		});
		this.cache = {};
	}
}
