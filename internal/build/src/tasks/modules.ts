import { rollup } from 'rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import VueMacros from 'unplugin-vue-macros/rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';
import glob from 'fast-glob';
import { epRoot, excludeFiles, pkgRoot } from '@lt-frame/build-utils';
import type { OutputOptions } from 'rollup';
import { generateExternal, writeBundles } from '../utils';
import { buildConfigEntries, target } from '../build-info';

export const buildModules = async () => {
	const input = excludeFiles(
		await glob('**/*.{js,ts,vue}', {
			cwd: pkgRoot,
			absolute: true,
			onlyFiles: true,
		})
	);
	const bundle = await rollup({
		input,
		plugins: [
			VueMacros({
				setupComponent: false,
				setupSFC: false,
				plugins: {
					vue: vue({
						isProduction: true,
					}),
					vueJsx: vueJsx(),
				},
			}),
			nodeResolve({
				extensions: ['.mjs', '.js', '.json', '.ts'],
			}),
			commonjs(),
			esbuild({
				sourceMap: true,
				target,
				loaders: {
					'.vue': 'ts',
				},
			}),
		],
		external: await generateExternal({ full: false }),
		treeshake: false,
	});
	await writeBundles(
		bundle,
		buildConfigEntries.map(
			([module, config]): OutputOptions => ({
				format: config.format,
				dir: config.output.path,
				exports: module === 'cjs' ? 'named' : undefined,
				preserveModules: true,
				preserveModulesRoot: epRoot,
				sourcemap: true,
				entryFileNames: `[name].${config.ext}`,
			})
		)
	);
};
