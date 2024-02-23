import { Ref, computed, ref, unref } from 'vue';

export function useFullScreen(wrapClassName: Ref<string | undefined>) {
	const fullScreenRef = ref(false);

	const getWrapClassName = computed(() => {
		const clsName = unref(wrapClassName) || '';
		return unref(fullScreenRef)
			? `fullscreen-modal ${clsName} `
			: unref(clsName);
	});

	function handleFullScreen(e: Event) {
		e && e.stopPropagation();
		fullScreenRef.value = !unref(fullScreenRef);
	}
	return {
		fullScreenRef,
		handleFullScreen,
		getWrapClassName,
	};
}
