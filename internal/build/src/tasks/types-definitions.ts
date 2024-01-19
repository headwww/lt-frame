import { Project } from 'ts-morph';
import path from 'path';
import glob from 'fast-glob';
import type { SourceFile } from 'ts-morph';
import { readFile, mkdir, writeFile } from 'fs/promises';
import * as vueCompiler from 'vue/compiler-sfc';
import consola from 'consola';
import process from 'process';
import { buildOutput, epRoot, pkgRoot, projRoot } from '../utils/paths';
import { excludeFiles, pathRewriter } from '../utils/pkg';

const outDir = path.resolve(buildOutput, 'types');
const TSCONFIG_PATH = path.resolve(projRoot, 'tsconfig.web.json');

export const generateTypesDefinitions = async () => {
	consola.success(projRoot);
	const project = new Project({
		compilerOptions: {
			// 仅生成声明文件（.d.ts 文件）
			emitDeclarationOnly: true,
			// 指定生成的文件输出目录
			outDir,
			// 指定了解析非相对模块名的基本目录，通常用于解析 import 语句中的模块路径。
			baseUrl: projRoot,
			// 保留符号链接的信息。
			preserveSymlinks: false,
			// 跳过对声明文件的类型检查。
			skipLibCheck: true,
			// 允许隐式的 any 类型。
			noImplicitAny: false,
		},
		// 指定了 TypeScript 配置文件的路径。
		tsConfigFilePath: TSCONFIG_PATH,
		// 表示不从 tsconfig.json 文件中添加文件到项目中。这个选项通常在手动配置项目时使用，而不是从 tsconfig.json 中读取项目配置。
		skipAddingFilesFromTsConfig: true,
	});

	const sourceFiles = await addSourceFiles(project);
	consola.success('Added source files');
	typeCheck(project);
	consola.success('Type check passed!');
	await project.emit({
		emitOnlyDtsFiles: true,
	});

	const tasks = sourceFiles.map(async (sourceFile) => {
		// 获取源文件相对路径
		const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());
		consola.success(relativePath);
		// 使用 sourceFile.getEmitOutput() 获取源文件的 EmitOutput，包含编译后的输出内容。
		const emitOutput = sourceFile.getEmitOutput();
		const emitFiles = emitOutput.getOutputFiles();
		if (emitFiles.length === 0) {
			throw new Error(`Emit no file: ${relativePath}`);
		}
		const subTasks = emitFiles.map(async (outputFile) => {
			const filepath = outputFile.getFilePath();
			await mkdir(path.dirname(filepath), {
				recursive: true,
			});
			await writeFile(
				filepath,
				pathRewriter('esm')(outputFile.getText()),
				'utf8'
			);
			consola.success(`Definition for file: ${relativePath} generated`);
		});
		await Promise.all(subTasks);
	});

	await Promise.all(tasks);
};

async function addSourceFiles(project: Project) {
	const globSourceFile = '**/*.{js?(x),ts?(x),vue}';
	const filePaths = excludeFiles(
		await glob([globSourceFile, '!lt-frame/**/*'], {
			cwd: pkgRoot,
			absolute: true,
			onlyFiles: true,
		})
	);

	const epPaths = excludeFiles(
		await glob(globSourceFile, {
			cwd: epRoot,
			onlyFiles: true,
		})
	);

	const sourceFiles: SourceFile[] = [];
	await Promise.all([
		...filePaths.map(async (file) => {
			if (file.endsWith('.vue')) {
				const content = await readFile(file, 'utf-8');
				const hasTsNoCheck = content.includes('@ts-nocheck');

				const sfc = vueCompiler.parse(content);
				const { script, scriptSetup } = sfc.descriptor;
				if (script || scriptSetup) {
					// eslint-disable-next-line no-shadow
					let content =
						(hasTsNoCheck ? '// @ts-nocheck\n' : '') + (script?.content ?? '');

					if (scriptSetup) {
						const compiled = vueCompiler.compileScript(sfc.descriptor, {
							id: 'xxx',
						});
						content += compiled.content;
					}

					const lang = scriptSetup?.lang || script?.lang || 'js';
					const sourceFile = project.createSourceFile(
						`${path.relative(process.cwd(), file)}.${lang}`,
						`${content}`
					);
					sourceFiles.push(sourceFile);
				}
			} else {
				const sourceFile = project.addSourceFileAtPath(file);
				sourceFiles.push(sourceFile);
			}
		}),
		...epPaths.map(async (file) => {
			const content = await readFile(path.resolve(epRoot, file), 'utf-8');
			sourceFiles.push(
				project.createSourceFile(path.resolve(pkgRoot, file), content)
			);
		}),
	]);
	return sourceFiles;
}

function typeCheck(project: Project) {
	const diagnostics = project.getPreEmitDiagnostics();
	if (diagnostics.length > 0) {
		consola.error(project.formatDiagnosticsWithColorAndContext(diagnostics));
		const err = new Error('Failed to generate dts.');
		consola.error(err);
		throw err;
	}
}
