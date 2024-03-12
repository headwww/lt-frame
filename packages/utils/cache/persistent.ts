import { toRaw } from 'vue';
import { pick, omit } from 'lodash-es';
import { Memory } from './memory';
import { createStorage, CreateStorageParams } from './storageCache';

let localMemory: Memory;
let sessionMemory: Memory;
let ls: any;
let ss: any;
let cacheKey: Partial<CacheConfig>;

export interface CacheConfig extends CreateStorageParams {
	appSessionCacheKey: string;
	appLocalCacheKey: string;
}

export function defineCache({
	appSessionCacheKey = 'LT__SESSION__KEY__',
	appLocalCacheKey = 'LT__LOCAL__KEY__',
	prefixKey = '',
	key = 'langtongkeji',
	iv = 'ltscm',
	hasEncrypt = true,
	timeout = 60 * 60 * 24 * 7,
}: Partial<CacheConfig> = {}) {
	cacheKey = {
		appSessionCacheKey,
		appLocalCacheKey,
	};
	localMemory = new Memory(timeout);
	sessionMemory = new Memory(timeout);

	const config = {
		prefixKey,
		key: key.padEnd(16, ' '),
		iv: iv.padEnd(16, ' '),
		hasEncrypt,
		timeout,
	};

	ls = createStorage({
		...config,
		storage: localStorage,
	});
	ss = createStorage({
		...config,
		storage: sessionStorage,
	});

	const localCache = ls.get(appLocalCacheKey);
	const sessionCache = ss.get(appSessionCacheKey);
	localCache && localMemory.resetCache(localCache);
	sessionCache && sessionMemory.resetCache(sessionCache);
}

// defineCache();

export class Persistent {
	static getLocal<T>(key: any) {
		return localMemory.get(key)?.value as T | null;
	}

	static setLocal(key: any, value: any, immediate = false): void {
		localMemory.set(key, toRaw(value));
		immediate && ls.set(cacheKey.appLocalCacheKey, localMemory.getCache);
	}

	static removeLocal(key: any, immediate = false): void {
		localMemory.remove(key);
		immediate && ls.set(cacheKey.appLocalCacheKey, localMemory.getCache);
	}

	static clearLocal(immediate = false): void {
		localMemory.clear();
		immediate && ls.clear();
	}

	static getSession<T>(key: any) {
		return sessionMemory.get(key)?.value as T | null;
	}

	static setSession(key: any, value: any, immediate = false): void {
		sessionMemory.set(key, toRaw(value));
		immediate && ss.set(cacheKey.appSessionCacheKey, sessionMemory.getCache);
	}

	static removeSession(key: any, immediate = false): void {
		sessionMemory.remove(key);
		immediate && ss.set(cacheKey.appSessionCacheKey, sessionMemory.getCache);
	}

	static clearSession(immediate = false): void {
		sessionMemory.clear();
		immediate && ss.clear();
	}

	static clearAll(immediate = false) {
		sessionMemory.clear();
		localMemory.clear();
		if (immediate) {
			ls.clear();
			ss.clear();
		}
	}
}

window.addEventListener('beforeunload', () => {
	// TOKEN_KEY 在登录或注销时已经写入到storage了，此处为了解决同时打开多个窗口时token不同步的问题
	// LOCK_KEY 在锁屏和解锁时写入，此处也不应修改
	ls.set(cacheKey.appLocalCacheKey, {
		...omit(localMemory.getCache, 'LOCK_KEY'),
		...pick(ls.get(cacheKey.appLocalCacheKey), ['USER_INFO', 'LOCK_KEY']),
	});

	ss.set(cacheKey.appSessionCacheKey, {
		...omit(sessionMemory.getCache, 'LOCK_KEY'),
		...pick(ss.get(cacheKey.appSessionCacheKey), ['USER_INFO', 'LOCK_KEY']),
	});
});

/**
 * 监听窗口即将关闭事件，用于同步缓存数据
 * @param e
 * @returns
 */
function storageChange(e: any) {
	const { key, newValue, oldValue } = e;

	if (!key) {
		Persistent.clearAll();
		return;
	}

	if (!!newValue && !!oldValue) {
		if (cacheKey.appLocalCacheKey === key) {
			Persistent.clearLocal();
		}
		if (cacheKey.appSessionCacheKey === key) {
			Persistent.clearSession();
		}
	}
}

window.addEventListener('storage', storageChange);
