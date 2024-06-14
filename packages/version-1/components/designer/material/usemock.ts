import { cloneDeep } from 'lodash-es';
import { ref } from 'vue';

/**
 * 模拟请求
 * @returns
 */
export function useMock() {
	const data = ref();

	function getData() {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(cloneDeep(data.value));
			}, 1000);
		});
	}

	function setDate(val: any) {
		data.value = cloneDeep(val);
	}

	return {
		getData,
		setDate,
	};
}
