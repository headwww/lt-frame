import { useRoute } from 'vue-router';

export function useTableId() {
	const route = useRoute();

	function tableId(suffix?: string) {
		const id: string = `${route.fullPath}/table_${suffix || ''}`;
		return id.replaceAll('/', '_');
	}
	return { tableId };
}
