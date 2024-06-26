import type { RouteLocationRaw, Router } from 'vue-router';

import { unref } from 'vue';

import { useRouter } from 'vue-router';
import { getAppConfig } from '../../configs';

function handleError(e: Error) {
	// eslint-disable-next-line no-console
	console.error(e);
}

/**
 * page switch
 */
export function useGo(_router?: Router) {
	const { push, replace } = _router || useRouter();
	function go(
		opt: RouteLocationRaw = getAppConfig().routes?.homePage!!,
		isReplace = false
	) {
		if (!opt) {
			return;
		}
		isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
	}
	return go;
}

/**
 * @description: redo current page
 */
export const useRedo = (_router?: Router) => {
	const { replace, currentRoute } = _router || useRouter();
	const { query, params = {}, name, fullPath } = unref(currentRoute.value);
	function redo(): Promise<boolean> {
		return new Promise((resolve) => {
			if (name === 'Redirect') {
				resolve(false);
				return;
			}
			if (name && Object.keys(params).length > 0) {
				params._origin_params = JSON.stringify(params ?? {});
				params._redirect_type = 'name';
				params.path = String(name);
			} else {
				params._redirect_type = 'path';
				params.path = fullPath;
			}

			replace({ name: 'Redirect', params, query }).then(() => resolve(true));
		});
	}
	return redo;
};
