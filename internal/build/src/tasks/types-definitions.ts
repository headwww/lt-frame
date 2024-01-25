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
	const project = new Project({
		compilerOptions: {
			emitDeclarationOnly: true,
			outDir,
			baseUrl: projRoot,
			preserveSymlinks: true,
			skipLibCheck: true,
			noImplicitAny: false,
		},
		tsConfigFilePath: TSCONFIG_PATH,
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
		const relativePath = path.relative(pkgRoot, sourceFile.getFilePath());
		consola.trace(relativePath);

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
						content
					);
					consola.success(content);

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
