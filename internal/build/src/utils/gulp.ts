import { buildRoot } from '@lt-frame/build-utils';
import type { TaskFunction } from 'gulp';
import { run } from './process';

export const withTaskName: any = <T extends TaskFunction>(
	name: string,
	fn: T
) => Object.assign(fn, { displayName: name });

export const runTask = (name: string) =>
	withTaskName(`shellTask:${name}`, () =>
		run(`pnpm run start ${name}`, buildRoot)
	);
