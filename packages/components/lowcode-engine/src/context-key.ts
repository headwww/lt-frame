import type { InjectionKey, Ref } from 'vue';

export interface SettingsPaneContext {
	// 给Popover弹出层加个锁，防止弹出modal的时候出现一起销毁的情况
	popoverLock: Ref<Boolean>;
}

export const settingsPaneContext: InjectionKey<SettingsPaneContext> = Symbol(
	'SettingsPaneContext'
);
