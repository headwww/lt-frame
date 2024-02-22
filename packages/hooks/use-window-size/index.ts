import { AnyFunction } from '@lt-frame/utils';
import { tryOnMounted, tryOnUnmounted, useDebounceFn } from '@vueuse/core';

interface UseWindowSizeOptions {
	wait?: number;
	once?: boolean;
	immediate?: boolean;
	listenerOptions?: AddEventListenerOptions | boolean;
}

/**
 * 用于监听浏览器窗口大小变化，并在窗口大小变化时执行指定的回调函数。
 * @param fn 一个函数，表示在窗口大小变化时要执行的回调函数。
 * @param options 一个可选的配置对象，包括以下选项：wait：指定在调用回调函数之前等待的毫秒数，默认为 150 毫秒。
 *                                            immediate：一个布尔值，指定是否在挂载时立即执行回调函数。
 *                                            listenerOptions：一个用于配置事件监听器的选项对象。
 *
 * @returns
 */
function useWindowSizeFn(fn: AnyFunction, options: UseWindowSizeOptions = {}) {
	const { wait = 150, immediate } = options;
	let handler = () => {
		fn();
	};
	const handleSize = useDebounceFn(handler, wait);
	handler = handleSize;

	const start = () => {
		if (immediate) {
			handler();
		}
		window.addEventListener('resize', handler);
	};

	const stop = () => {
		window.removeEventListener('resize', handler);
	};

	tryOnMounted(() => {
		start();
	});

	tryOnUnmounted(() => {
		stop();
	});
	return { start, stop };
}

export { useWindowSizeFn, type UseWindowSizeOptions };
