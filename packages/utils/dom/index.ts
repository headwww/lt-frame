import type { FunctionArgs } from '@vueuse/core';
import { upperFirst } from 'lodash-es';
import { Fn } from '../types';

export interface ViewportOffsetResult {
	left: number;
	top: number;
	right: number;
	bottom: number;
	rightIncludeBody: number;
	bottomIncludeBody: number;
}

export function getBoundingClientRect(element: Element): DOMRect | number {
	if (!element || !element.getBoundingClientRect) {
		return 0;
	}
	return element.getBoundingClientRect();
}

function trim(string: string) {
	return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

export function hasClass(el: Element, cls: string) {
	if (!el || !cls) return false;
	if (cls.indexOf(' ') !== -1)
		throw new Error('className should not contain space.');
	if (el.classList) {
		return el.classList.contains(cls);
	}
	return ` ${el.className} `.indexOf(` ${cls} `) > -1;
}

export function addClass(el: Element, cls: string) {
	if (!el) return;
	let curClass = el.className;
	const classes = (cls || '').split(' ');

	// eslint-disable-next-line no-plusplus
	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		// eslint-disable-next-line no-continue
		if (!clsName) continue;

		if (el.classList) {
			el.classList.add(clsName);
		} else if (!hasClass(el, clsName)) {
			curClass += ` ${clsName}`;
		}
	}
	if (!el.classList) {
		el.className = curClass;
	}
}

export function removeClass(el: Element, cls: string) {
	if (!el || !cls) return;
	const classes = cls.split(' ');
	let curClass = ` ${el.className} `;

	// eslint-disable-next-line no-plusplus
	for (let i = 0, j = classes.length; i < j; i++) {
		const clsName = classes[i];
		// eslint-disable-next-line no-continue
		if (!clsName) continue;

		if (el.classList) {
			el.classList.remove(clsName);
		} else if (hasClass(el, clsName)) {
			curClass = curClass.replace(` ${clsName} `, ' ');
		}
	}
	if (!el.classList) {
		el.className = trim(curClass);
	}
}
/**
 * 获取当前元素的左侧和顶部偏移
 * left：最左边的元素与文档左侧之间的距离
 * top：从元素顶部到文档顶部的距离
 * right：元素最右边到文档右边的距离
 * bottom：元素底部到文档底部的距离
 * rightIncludeBody：最左边的元素与文档右侧之间的距离
 * bottomIncludeBody：从元素底部到文档底部的距离
 * @param element
 * @returns
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
	const doc = document.documentElement;
	const docScrollLeft = doc.scrollLeft;
	const docScrollTop = doc.scrollTop;
	const docClientLeft = doc.clientLeft;
	const docClientTop = doc.clientTop;

	const { pageXOffset } = window;
	const { pageYOffset } = window;

	const box = getBoundingClientRect(element);

	const {
		left: retLeft,
		top: rectTop,
		width: rectWidth,
		height: rectHeight,
	} = box as DOMRect;

	const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
	const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
	const offsetLeft = retLeft + pageXOffset;
	const offsetTop = rectTop + pageYOffset;

	const left = offsetLeft - scrollLeft;
	const top = offsetTop - scrollTop;

	const { clientWidth } = window.document.documentElement;
	const { clientHeight } = window.document.documentElement;
	return {
		left,
		top,
		right: clientWidth - rectWidth - left,
		bottom: clientHeight - rectHeight - top,
		rightIncludeBody: clientWidth - left,
		bottomIncludeBody: clientHeight - top,
	};
}

export function hackCss(attr: string, value: string) {
	const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT'];

	const styleObj: any = {};
	prefix.forEach((item) => {
		styleObj[`${item}${upperFirst(attr)}`] = value;
	});
	return {
		...styleObj,
		[attr]: value,
	};
}

/* istanbul ignore next */
export function on(
	element: Element | HTMLElement | Document | Window,
	event: string,
	handler: EventListenerOrEventListenerObject
): void {
	if (element && event && handler) {
		element.addEventListener(event, handler, false);
	}
}

/* istanbul ignore next */
export function off(
	element: Element | HTMLElement | Document | Window,
	event: string,
	handler: Fn
): void {
	if (element && event && handler) {
		element.removeEventListener(event, handler, false);
	}
}

/* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
	// eslint-disable-next-line func-names
	const listener = function (this: any, ...args: unknown[]) {
		if (fn) {
			fn.apply(this, args as [evt: Event]);
		}
		off(el, event, listener);
	};
	on(el, event, listener);
}

export function useRafThrottle<T extends FunctionArgs>(fn: T): T {
	let locked = false;
	// @ts-ignore
	// eslint-disable-next-line func-names
	return function (...args: any[]) {
		if (locked) return;
		locked = true;
		window.requestAnimationFrame(() => {
			// @ts-ignore
			fn.apply(this, args);
			locked = false;
		});
	};
}

/**
 * @description:  设置ui装载节点
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
	return (node?.parentNode as HTMLElement) ?? document.body;
}

const scrollIntoViewIfNeeded = 'scrollIntoViewIfNeeded';
const scrollIntoView = 'scrollIntoView';

export function scrollToView(elem: any) {
	if (elem) {
		if (elem[scrollIntoViewIfNeeded]) {
			elem[scrollIntoViewIfNeeded]();
		} else if (elem[scrollIntoView]) {
			elem[scrollIntoView]();
		}
	}
}

/**
 * 滚动动画
 * @param element
 * @param targetScrollTop
 * @param duration
 */
export const smoothScroll = (
	element: any,
	targetScrollTop: any,
	duration: any
) => {
	const startScrollTop = element.scrollTop;
	const distance = targetScrollTop - startScrollTop;
	const startTime = performance.now();

	const animateScroll = (currentTime: any) => {
		const elapsedTime = currentTime - startTime;
		const progress = Math.min(elapsedTime / duration, 1);
		const easeInOut = (t: any) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); // ease-in-out function

		element.scrollTop = startScrollTop + distance * easeInOut(progress);

		if (progress < 1) {
			requestAnimationFrame(animateScroll);
		}
	};

	requestAnimationFrame(animateScroll);
};
