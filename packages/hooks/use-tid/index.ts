import { useRoute } from 'vue-router';

export function useTableId() {
	const route = useRoute();

	function buildTableId(suffix?: string) {
		return `${route.fullPath}/table_${suffix || ''}`.replaceAll('/', '_');
	}
	return { buildTableId };
}
