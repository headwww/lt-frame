import { isNullOrUnDef } from '@lt-frame/utils';
import { computed } from 'vue';
import { VxeGlobalRendererHandles } from 'vxe-table';

export function useEdit(params?: VxeGlobalRendererHandles.RenderEditParams) {
	const getAttrs = computed(() => params?.column.editRender.attrs);

	/**
	 * 在额外的参数params中添加，添加notNull字段，是否是必填字段
	 */
	const getStatus = computed((): '' | 'error' | 'warning' => {
		const mParams = params?.column.params;
		if (isNullOrUnDef(mParams)) {
			return '';
		}
		if (mParams.notNull) {
			return 'error';
		}
		return '';
	});

	return {
		getAttrs,
		getStatus,
	};
}
