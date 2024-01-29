import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import stylelitPlugin from 'vite-plugin-stylelint';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from 'node:path';

export default defineConfig({
	plugins: [
		vue(),
		eslintPlugin(),
		stylelitPlugin(),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'assets/icons')],
			symbolId: 'icon-[dir]-[name]',
			svgoOptions: true,
		}),
	],
});
