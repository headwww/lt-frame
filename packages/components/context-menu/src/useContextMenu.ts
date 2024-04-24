import { onUnmounted, getCurrentInstance } from 'vue';
import { createContextMenu, destroyContextMenu } from './createContextMenu';
import { ContextMenuItem } from './context-menu';

export type { ContextMenuItem };
export function useContextMenu(authRemove = true) {
	if (getCurrentInstance() && authRemove) {
		onUnmounted(() => {
			destroyContextMenu();
		});
	}
	return [createContextMenu, destroyContextMenu];
}
