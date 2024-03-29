import { ref, getCurrentInstance, unref } from 'vue';
import { Nullable } from '@lt-frame/utils';
import {
	DescInstance,
	DescriptionProps,
	UseDescReturnType,
} from '@lt-frame/components';

export function useDescription(
	props?: Partial<DescriptionProps>
): UseDescReturnType {
	if (!getCurrentInstance()) {
		throw new Error(
			'useDescription() can only be used inside setup() or functional components!'
		);
	}
	const desc = ref<Nullable<DescInstance>>(null);
	const loaded = ref(false);

	function register(instance: DescInstance) {
		if (unref(loaded) && process.env.NODE_ENV === 'production') {
			return;
		}
		desc.value = instance;
		props && instance.setDescProps(props);
		loaded.value = true;
	}

	const methods: DescInstance = {
		setDescProps: (descProps: Partial<DescriptionProps>): void => {
			unref(desc)?.setDescProps(descProps);
		},
	};

	return [register, methods];
}
