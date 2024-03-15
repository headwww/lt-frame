import { App, Plugin } from 'vue';

/**
 * 为组件添加安装方法，使其可以通过 Vue 3 的应用程序实例进行安装
 *
 * @template T - 组件类型，必须是一个继承自 Component 的对象，并且可以有 displayName 属性
 * @param {T} component - 要添加安装方法的组件
 * @param {string} alias - 组件的别名，可选参数
 * @returns {T & Plugin} - 添加了安装方法的组件，以及符合 Vue 3 插件要求的类型
 */
// export const withInstall = <T extends Component & { displayName?: string }>(
// 	component: T,
// 	alias?: string
// ) => {
// 	const comp = component as any;
// 	comp.install = (app: App) => {
// 		app.component(comp.name || comp.displayName, component);
// 		if (alias) {
// 			app.config.globalProperties[alias] = component;
// 		}
// 	};
// 	return component as T & Plugin;
// };

export const withInstall = <T, E extends Record<string, any>>(
	main: T,
	extra?: E
) => {
	(main as SFCWithInstall<T>).install = (app: App): void => {
		for (const comp of [main, ...Object.values(extra ?? {})]) {
			app.component(comp.name, comp);
		}
	};

	if (extra) {
		for (const [key, comp] of Object.entries(extra)) {
			(main as any)[key] = comp;
		}
	}
	return main as SFCWithInstall<T> & E;
};

export type SFCWithInstall<T> = T & Plugin;
