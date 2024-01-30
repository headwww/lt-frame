import { entries } from 'lodash-es';
import { getCurrentInstance, reactive, shallowRef, watchEffect } from 'vue';

interface UseAttrsOptions {
	// 是否排除监听器属性
	excludeListeners?: boolean;
	// 需要排除的其他属性键名数组
	excludeKeys?: string[];
	// 是否排除默认的属性键名数组
	excludeDefaultKeys?: boolean;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];

const LISTENER_PREFIX = /^on[A-Z]/;

function useAttrs(options: UseAttrsOptions = {}): Record<string, any> {
	const instance = getCurrentInstance();
	if (!instance) return {};

	const {
		excludeListeners = false,
		excludeKeys = [],
		excludeDefaultKeys = true,
	} = options;

	const attrs = shallowRef({});

	const allExcludeKeys = excludeKeys.concat(
		excludeDefaultKeys ? DEFAULT_EXCLUDE_KEYS : []
	);

	instance.attrs = reactive(instance.attrs);

	watchEffect(() => {
		const res = entries(instance.attrs).reduce(
			(acm, [key, val]) => {
				if (
					!allExcludeKeys.includes(key) &&
					!(excludeListeners && LISTENER_PREFIX.test(key))
				) {
					acm[key] = val;
				}

				return acm;
			},
			{} as Record<string, any>
		);
		attrs.value = res;
	});

	return attrs;
}

export { useAttrs, type UseAttrsOptions };
