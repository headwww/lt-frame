import { createVNode, render } from 'vue';
import { Fn, isClient } from '@lt-frame/utils';
import contextMenuVue from './context-menu.vue';
import { CreateContextOptions, ContextMenuProps } from './context-menu';

const menuManager: {
	domList: Element[];
	resolve: Fn;
} = {
	domList: [],
	resolve: () => {},
};

export const createContextMenu = function (options: CreateContextOptions) {
	const { event } = options || {};

	event && event?.preventDefault();

	if (!isClient) {
		return;
	}
	return new Promise((resolve) => {
		const { body } = document;

		const container = document.createElement('div');
		const propsData: Partial<ContextMenuProps> = {};
		if (options.styles) {
			propsData.styles = options.styles;
		}

		if (options.items) {
			propsData.items = options.items;
		}

		if (options.event) {
			propsData.customEvent = event;
			propsData.axis = { x: event.clientX, y: event.clientY + body.scrollTop }; // y坐标需加上body往上滚动的Y
		}

		const vm = createVNode(contextMenuVue, propsData);
		render(vm, container);
		// eslint-disable-next-line func-names
		const handleClick = function () {
			menuManager.resolve('');
		};

		menuManager.domList.push(container);

		// eslint-disable-next-line func-names
		const remove = function () {
			menuManager.domList.forEach((dom: Element) => {
				try {
					dom && body.removeChild(dom);
				} catch (error) {
					//
				}
			});
			body.removeEventListener('click', handleClick);
			body.removeEventListener('scroll', handleClick);
		};
		// eslint-disable-next-line func-names
		menuManager.resolve = function (arg) {
			remove();
			resolve(arg);
		};
		remove();
		body.appendChild(container);
		body.addEventListener('click', handleClick);
		body.addEventListener('scroll', handleClick);
	});
};

export const destroyContextMenu = function () {
	if (menuManager) {
		menuManager.resolve('');
		menuManager.domList = [];
	}
};
