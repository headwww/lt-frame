import type { ObjectDirective, Ref } from 'vue';
import { isProxy } from 'vue';
import type { RefOrValue } from './types';
import { useDraggable, UseDraggableOptions } from './useDraggable';

const directiveHooks = {
	mounted: 'mounted',
	unmounted: 'unmounted',
};

type VDraggableBinding = [
	list: Ref<any[]>,
	options?: RefOrValue<UseDraggableOptions<any>>,
];

const elementMap: WeakMap<HTMLElement, () => void> = new WeakMap();

export const vDraggable: ObjectDirective<
	HTMLElement,
	VDraggableBinding | Ref<any[]>
> = {
	[directiveHooks.mounted](el: any, binding: any) {
		const params = isProxy(binding.value) ? [binding.value] : binding.value;

		const state = useDraggable(el!, ...(params as VDraggableBinding));
		elementMap.set(el, state.destroy);
	},
	[directiveHooks.unmounted](el: any) {
		elementMap.get(el)?.();
		elementMap.delete(el);
	},
};
