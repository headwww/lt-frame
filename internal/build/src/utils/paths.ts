import { resolve } from 'path';
// 根目录
export const projRoot = resolve(__dirname, '..', '..', '..', '..');

export const pkgRoot = resolve(projRoot, 'packages');

export const epRoot = resolve(pkgRoot, 'lt-frame');

// gulp的目录
export const buildRoot = resolve(projRoot, 'internal', 'build');
/** `/dist` */
export const buildOutput = resolve(projRoot, 'dist');

/** `/dist/lt-frame` */
export const epOutput = resolve(buildOutput, 'lt-frame');

export const epPackage = resolve(epRoot, 'package.json');
