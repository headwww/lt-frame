import { defineStore } from 'pinia';

let timeId: ReturnType<typeof setTimeout>;

export const useAppStore = defineStore({
	id: 'lt-app',
	state: () => ({
		pageLoading: false,
	}),
	getters: {
		getPageLoading(state): boolean {
			return state.pageLoading;
		},
	},
	actions: {
		setPageLoading(loading: boolean): void {
			this.pageLoading = loading;
		},
		async setPageLoadingAction(loading: boolean): Promise<void> {
			if (loading) {
				clearTimeout(timeId);
				// 防止闪烁
				timeId = setTimeout(() => {
					this.setPageLoading(loading);
				}, 50);
			} else {
				this.setPageLoading(loading);
				clearTimeout(timeId);
			}
		},
	},
});
