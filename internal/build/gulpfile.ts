// 打包方式：串行(series)  并行(parallel)
import { series, parallel, TaskFunction } from 'gulp';
import { mkdir, copyFile } from 'fs/promises';
import { copy } from 'fs-extra';
import path from 'path';
import {
	buildOutput,
	epOutput,
	epPackage,
	projRoot,
} from '@lt-frame/build-utils';
import { withTaskName, run, runTask } from './src/utils';
import { Module, buildConfig } from './src/build-info';

export const copyFiles = () =>
	Promise.all([
		copyFile(epPackage, path.join(epOutput, 'package.json')),
		copyFile(
			path.resolve(projRoot, 'README.md'),
			path.resolve(epOutput, 'README.md')
		),
		copyFile(
			path.resolve(projRoot, 'global.d.ts'),
			path.resolve(epOutput, 'global.d.ts')
		),
	]);

export const copyTypesDefinitions: TaskFunction = (done) => {
	const src = path.resolve(buildOutput, 'types', 'packages');
	const copyTypes = (module: Module) =>
		withTaskName(`copyTypes:${module}`, () =>
			copy(src, buildConfig[module].output.path)
		);

	return parallel(copyTypes('esm'), copyTypes('cjs'))(done);
};

export const copyFullStyle = async () => {
	await mkdir(path.resolve(epOutput, 'dist'), { recursive: true });
	await copyFile(
		path.resolve(epOutput, 'theme-chalk/index.css'),
		path.resolve(epOutput, 'dist/index.css')
	);
};

export default series(
	withTaskName('clean', () => run('pnpm run clean')),
	withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

	parallel(
		runTask('buildModules'),
		runTask('generateTypesDefinitions'),
		series(
			withTaskName('buildThemeChalk', () =>
				run('pnpm run -C packages/theme-chalk build')
			),
			copyFullStyle
		)
	),

	parallel(copyTypesDefinitions, copyFiles)
) as any;

export * from './src';
