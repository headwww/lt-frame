import { nextTick, onActivated, onMounted } from 'vue';
import { AnyFunction } from '../types';

/**
 * 统一触发操作：onMountedOrActivated 函数提供了一个统一的方式来触发操作，
 * 无论是在组件被挂载到 DOM 后还是在组件被激活时。这可以减少代码重复，
 * 确保某个操作在这两种情况下都能够执行。处理异步操作：
 * 由于 nextTick 函数被用于标记组件已经被挂载，可以确保异步操作在组件渲染完成后执行，
 * 从而避免了可能的 DOM 操作问题。防止不必要的执行：通过使用 mounted 变量，
 * 它可以防止在组件被激活时重复执行操作。只有在组件被挂载后，onActivated 钩子才会执行操作，
 * 从而避免不必要的触发。
 * 在 OnMounted 或者 OnActivated 时触发
 * @param hook 任何函数（包括异步函数）
 */
function onMountedOrActivated(hook: AnyFunction) {
	let mounted: boolean;

	onMounted(() => {
		hook();
		nextTick(() => {
			mounted = true;
		});
	});

	onActivated(() => {
		if (mounted) {
			hook();
		}
	});
}

export { onMountedOrActivated };
