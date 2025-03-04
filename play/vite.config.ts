import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import eslintPlugin from 'vite-plugin-eslint';
import stylelitPlugin from 'vite-plugin-stylelint';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from 'node:path';
import UnoCss from 'unocss/vite';

export default defineConfig({
	plugins: [
		vue(),
		vueJsx(),
		eslintPlugin(),
		stylelitPlugin(),
		UnoCss({
			configFile: '../uno.config.ts',
		}),
		createSvgIconsPlugin({
			iconDirs: [resolve(process.cwd(), 'assets/icons')],
			symbolId: 'icon-[dir]-[name]',
			svgoOptions: true,
		}),
	],
	server: {
		host: '0.0.0.0',
		port: 9092,
		proxy: {
			'/ltApi': {
				// target: 'http://192.168.1.150:8080/',
				// target: 'http://49.74.206.150:8081/',
				// target: 'http://ltscm.tpddns.cn:8081/',
				target: 'http://ltscn.kmdns.net:9092/',
				// target: 'http://192.168.1.241:9090/',
				// target: 'http://192.168.1.153:8080/',
				// target: 'http://192.168.1.118:8080/',
				// target: 'http://ltscm.3322.org:8081/',
				// target: 'http://192.168.1.241:9090/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/ltApi/, ''),
			},
		},
	},
});
