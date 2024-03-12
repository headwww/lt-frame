import { defineStore } from 'pinia';
import { Persistent, deepMerge, DeepPartial } from '@lt-frame/utils';
import { MenuSetting, ProjectConfig } from '../types';
import { resetRouter } from '../router';

let timeId: ReturnType<typeof setTimeout>;

export interface AppState {
	projectConfig: ProjectConfig | null;
	pageLoading: boolean;
}

export const useAppStore = defineStore({
	id: 'lt-app',
	state: (): AppState => ({
		pageLoading: false,
		projectConfig: Persistent.getLocal('PROJ__KEY'),
	}),
	getters: {
		getPageLoading(state): boolean {
			return state.pageLoading;
		},
		getProjectConfig(state): ProjectConfig {
			return state.projectConfig || ({} as ProjectConfig);
		},
		getMenuSetting(): MenuSetting {
			return this.getProjectConfig.menuSetting;
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
		setProjectConfig(config: DeepPartial<ProjectConfig>): void {
			this.projectConfig = deepMerge(
				this.projectConfig || {},
				config
			) as ProjectConfig;
			Persistent.setLocal('PROJ_KEY', this.projectConfig);
		},
		setMenuSetting(setting: Partial<MenuSetting>): void {
			this.projectConfig!.menuSetting = deepMerge(
				this.projectConfig!.menuSetting,
				setting
			);
			if (this.projectConfig) {
				Persistent.setLocal('PROJ_KEY', this.projectConfig);
			}
		},
		async resetAllState() {
			resetRouter();
			Persistent.clearAll(true);
		},
	},
});
