import { computed } from 'vue';
import { useAppStore } from '../../stores';

export function useAppSetting() {
	const appStore = useAppStore();

	const getPageLoading = computed(() => appStore.getPageLoading);
	return {
		getPageLoading,
	};
}
