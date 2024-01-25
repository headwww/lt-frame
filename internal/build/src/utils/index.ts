import { spawn } from 'child_process';
import type { TaskFunction } from 'gulp';
import { projRoot, buildRoot } from './paths';

// 自定义每个task的name
export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
	Object.assign(fn, { displayName: name });

// 在node中开启一个子进程来运行脚本
export const run = async (command: string, cwd: string = projRoot) =>
	new Promise<void>((resolve, reject) => {
		const [cmd, ...args] = command.split(' ');
		const app = spawn(cmd, args, {
			cwd,
			stdio: 'inherit',
			shell: true,
		});

		const onProcessExit = () => app.kill('SIGHUP');

		app.on('close', (code) => {
			process.removeListener('exit', onProcessExit);
			if (code === 0) resolve();
			else
				reject(
					new Error(`Command failed. \n Command: ${command} \n Code: ${code}`)
				);
		});
		process.on('exit', onProcessExit);
	});

// 执行方法
export const runTask = (name: string) =>
	withTaskName(`shellTask:${name}`, () =>
		run(`pnpm run start ${name}`, buildRoot)
	);
