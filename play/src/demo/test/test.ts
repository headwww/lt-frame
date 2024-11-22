/*
 * @Author: shuwen 1243889238@qq.com
 * @Date: 2024-11-20 17:09:20
 * @LastEditors: shuwen 1243889238@qq.com
 * @LastEditTime: 2024-11-20 17:11:45
 * @FilePath: /lt-frame/play/src/demo/test/test.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { WidgetType } from '@codemirror/view';
import { createApp } from 'vue';

// 定义 Vue 组件渲染的 Widget
export class VueWidget extends WidgetType {
	id: string;

	constructor(id: string) {
		super();
		this.id = id;
	}

	toDOM() {
		// 创建一个容器
		const container = document.createElement('span');
		container.className = 'vue-widget';

		// 动态挂载 Vue 组件
		const app = createApp({
			template: `<a-button type="primary">{{ id }}</a-button>`,
			props: ['id'],
			// eslint-disable-next-line vue/no-dupe-keys
			data: () => ({ id: this.id }),
		});

		// 挂载 Ant Design Vue 的 Button 组件
		app.mount(container);

		return container;
	}

	ignoreEvent() {
		return true; // 禁用事件触发，保持编辑器交互
	}
}
