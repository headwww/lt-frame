// 打包方式：串行(series)  并行(parallel)
import { series, parallel, TaskFunction } from 'gulp';
import { mkdir, copyFile } from 'fs/promises';
import { copy } from 'fs-extra';
import path from 'path';
import { withTaskName, run, runTask } from './src/utils';
import { buildOutput, epOutput, epPackage, projRoot } from './src/utils/paths';
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

export default series(
	// 删除dist目录
	withTaskName('clean', async () => run('pnpm run clean')),
	// 创建dist/lt-frame目录
	withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),
	parallel(runTask('buildModules'), runTask('generateTypesDefinitions')),
	parallel(copyTypesDefinitions, copyFiles)
);

export * from './src';
