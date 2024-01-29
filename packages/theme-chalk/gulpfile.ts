import { epOutput } from '@lt-frame/build-utils';
import { series, dest, src, parallel } from 'gulp';
import autoPrefixer from 'gulp-autoprefixer';
import gulpLess from 'gulp-less';
import path from 'path';
import cleanCSS from 'gulp-clean-css';
import consola from 'consola';
import rename from 'gulp-rename';
import dartLess from 'less';
import chalk from 'chalk';

const distBundle = path.resolve(epOutput, 'theme-chalk');
const distFolder = path.resolve(__dirname, 'dist');

async function buildThemeChalk() {
	const noElPrefixFile = /(index|base|display)/;
	return src(path.resolve(__dirname, 'src/*.less'))
		.pipe(gulpLess(dartLess))
		.pipe(autoPrefixer({ cascade: false }))
		.pipe(
			cleanCSS({}, (details) => {
				consola.success(
					`${chalk.cyan(details.name)}: ${chalk.yellow(
						details.stats.originalSize / 1000
					)} KB -> ${chalk.green(details.stats.minifiedSize / 1000)} KB`
				);
			})
		)
		.pipe(
			rename((path) => {
				if (!noElPrefixFile.test(path.basename)) {
					path.basename = `lt-${path.basename}`;
				}
			})
		)
		.pipe(dest(distFolder));
}

export async function copyThemeChalkSource() {
	return src(path.resolve(__dirname, 'src/**')).pipe(
		dest(path.resolve(distBundle, 'src'))
	);
}

export function copyThemeChalkBundle() {
	return src(`${distFolder}/**`).pipe(dest(distBundle));
}

export const build = parallel(
	copyThemeChalkSource,
	series(buildThemeChalk, copyThemeChalkBundle)
);

export default build;
