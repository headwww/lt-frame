import { nextTick, unref } from 'vue';
import type { Ref } from 'vue';
import type { Options } from 'sortablejs';

/**
 * sortablejs 的配置
 * @param el
 * @param options
 * @returns
 */
export function useSortable(
	el: HTMLElement | Ref<HTMLElement>,
	options?: Options
) {
	function initSortable() {
		nextTick(async () => {
			if (!el) return;

			const Sortable = (await import('sortablejs')).default;
			Sortable.create(unref(el), {
				animation: 250,
				delay: 200,
				delayOnTouchOnly: true,
				...options,
			});
		});
	}

	return { initSortable };
}
