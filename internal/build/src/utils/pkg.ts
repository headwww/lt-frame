import { buildConfig } from '../build-info';

import type { Module } from '../build-info';

/** used for type generator */
export const pathRewriter = (module: Module) => {
	const config = buildConfig[module];

	return (id: string) => {
		id = id.replaceAll('@lt-frame/theme-chalk', 'lt-frame/theme-chalk');
		id = id.replaceAll(`@lt-frame/`, `${config.bundle.path}/`);
		return id;
	};
};
