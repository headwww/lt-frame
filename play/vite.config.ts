/*
 * @Author: shuwen 1243889238@qq.com
 * @Date: 2024-03-06 09:29:53
 * @LastEditors: shuwen 1243889238@qq.com
 * @LastEditTime: 2024-11-22 14:56:33
 * @FilePath: /lt-frame/play/vite.config.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
				// target: 'http://192.168.1.6:8080/',
				// target: 'http://192.168.1.117:8080/',
				target: 'http://192.168.1.118:8080/',
				// target: 'http://ltscm.3322.org:8081/',
				// target: 'http://192.168.1.241:9090/',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/ltApi/, ''),
			},
		},
	},
});
