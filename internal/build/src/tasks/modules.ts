import glob from 'fast-glob';
import { OutputOptions, rollup } from 'rollup';
import esbuild from 'rollup-plugin-esbuild';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import VueMacros from 'unplugin-vue-macros/rollup';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { epRoot, pkgRoot } from '../utils/paths';
import { excludeFiles } from '../utils/pkg';
import { generateExternal, writeBundles } from '../utils/rollup';
import { buildConfigEntries, target } from '../build-info';

export const buildModules = async () => {
	// 过滤掉不需要打包的文件
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
			// 处理一些宏
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
			// 用于帮助 Rollup 解析模块的导入路径，确保在构建过程中正确处理模块的依赖关系。
			nodeResolve({
				extensions: ['.mjs', '.js', '.json', '.ts'],
			}),
			// 将 CommonJS 模块（一种在 Node.js 等环境中常见的模块规范）转换为 ES6 模块，以便它们能够在浏览器环境中正确运行。
			commonjs(),
			// 代码快速转译和压缩
			esbuild({
				// 保存了源代码和转译后代码之间的映射关系
				sourceMap: true,
				target,
				// 加载vue文件使用ts加载器
				loaders: {
					'.vue': 'ts',
				},
			}),
		],
		// 排除一些依赖，防止这些依赖被引入之后路径错误
		// 未设置这个属性 打包后 import isNil from '../../node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/isNil.mjs'
		// 设置后import { isNil } from 'lodash-es';
		external: await generateExternal({ full: false }),
		// 删除一些引入后没有使用的模块，设置为false代表不删除
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
				preserveModulesRoot: `${epRoot}`,
				sourcemap: true,
				entryFileNames: `[name].${config.ext}`,
			})
		)
	);
};
