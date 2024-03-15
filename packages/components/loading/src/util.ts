import { VNode, defineComponent, createVNode, render, reactive, h } from 'vue';

import loading from './lt-loading.vue';
import { LoadingProps } from './loading';

export function createLoading(
	props?: Partial<LoadingProps>,
	target?: HTMLElement,
	wait = false
) {
	let vm: VNode | null = null;
	const data = reactive({
		tip: '',
		loading: true,
		...props,
	});

	const LoadingWrap = defineComponent({
		render() {
			return h(loading, { ...data });
		},
	});

	vm = createVNode(LoadingWrap);

	if (wait) {
		setTimeout(() => {
			render(vm, document.createElement('div'));
		}, 0);
	} else {
		render(vm, document.createElement('div'));
	}

	function close() {
		if (vm?.el && vm.el.parentNode) {
			vm.el.parentNode.removeChild(vm.el);
		}
	}

	function open(target: HTMLElement = document.body) {
		if (!vm || !vm.el) {
			return;
		}
		target.appendChild(vm.el as HTMLElement);
	}

	if (target) {
		open(target);
	}
	return {
		vm,
		close,
		open,
		setTip: (tip: string) => {
			data.tip = tip;
		},
		setLoading: (loading: boolean) => {
			data.loading = loading;
		},
		get loading() {
			return data.loading;
		},
		get $el() {
			return vm?.el as HTMLElement;
		},
	};
}
