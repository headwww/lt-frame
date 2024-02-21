import { LoadingProps, createLoading } from '@lt-frame/components';
import { Ref, unref } from 'vue';

export interface UseLoadingOptions {
	target?: any;
	props?: Partial<LoadingProps>;
}

interface Fn {
	(): void;
}
type ElRef<T extends HTMLElement = HTMLDivElement> = T | null;

export function useLoading(
	props: Partial<LoadingProps>
): [Fn, Fn, (arg0: string) => void];
// eslint-disable-next-line no-redeclare
export function useLoading(
	opt: Partial<UseLoadingOptions>
): [Fn, Fn, (arg0: string) => void];

// eslint-disable-next-line no-redeclare
export function useLoading(
	opt: Partial<LoadingProps> | Partial<UseLoadingOptions>
): [Fn, Fn, (arg0: string) => void] {
	let props: Partial<LoadingProps>;
	let target: HTMLElement | Ref<ElRef> = document.body;

	if (Reflect.has(opt, 'target') || Reflect.has(opt, 'props')) {
		const options = opt as Partial<UseLoadingOptions>;
		props = options.props || {};
		target = options.target || document.body;
	} else {
		props = opt as Partial<LoadingProps>;
	}

	const instance = createLoading(props, undefined, true);

	const open = (): void => {
		const t = unref(target as Ref<ElRef>);
		if (!t) return;
		instance.open(t);
	};

	const close = (): void => {
		instance.close();
	};

	const setTip = (tip: string) => {
		instance.setTip(tip);
	};

	return [open, close, setTip];
}
