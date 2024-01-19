import path from 'path';

import type { ModuleFormat } from 'rollup';
import { epOutput } from './utils/paths';

export const modules = ['esm', 'cjs'] as const;
export type Module = (typeof modules)[number];
export interface BuildInfo {
	module: 'ESNext' | 'CommonJS';
	format: ModuleFormat;
	ext: 'mjs' | 'cjs' | 'js';
	output: {
		/** e.g: `es` */
		name: string;
		/** e.g: `dist/lt-frame/es` */
		path: string;
	};

	bundle: {
		/** e.g: `lt-frame/es` */
		path: string;
	};
}

export const buildConfig: Record<Module, BuildInfo> = {
	esm: {
		module: 'ESNext',
		format: 'esm',
		ext: 'mjs',
		output: {
			name: 'es',
			path: path.resolve(epOutput, 'es'),
		},
		bundle: {
			path: 'lt-frame/es',
		},
	},
	cjs: {
		module: 'CommonJS',
		format: 'cjs',
		ext: 'js',
		output: {
			name: 'lib',
			path: path.resolve(epOutput, 'lib'),
		},
		bundle: {
			path: 'lt-frame/lib',
		},
	},
};
export const buildConfigEntries = Object.entries(
	buildConfig
) as BuildConfigEntries;

export type BuildConfig = typeof buildConfig;
export type BuildConfigEntries = [Module, BuildInfo][];

export const target = 'es2018';
