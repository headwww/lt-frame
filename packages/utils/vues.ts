import { PropType, App, Component } from 'vue';
import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

/**
 * 定义用于类型推断的 prop 类型函数
 * @param val 用于类型推断的值
 * @returns 与输入值类型相同的 prop 类型
 * @example
 * // 使用示例
 * const propValue: string = 'example';
 * const propType: PropType<string> = definePropType(propValue);
 */
export const definePropType = <T>(val: any): PropType<T> => val;

/**
 * 获取原始路由对象的工具函数
 * @param route 处理前的路由对象
 * @returns 去除部分属性的新路由对象，保留 meta、name 和 path 属性，并重新构建 matched 数组
 */
export function getRawRoute(
	route: RouteLocationNormalized
): RouteLocationNormalized {
	if (!route) return route;
	const { matched, ...opt } = route;
	const newMatched = matched
		? matched.map((item) => ({
				meta: item.meta,
				name: item.name,
				path: item.path,
			}))
		: undefined;
	return {
		...opt,
		matched: newMatched as RouteRecordNormalized[],
	};
}

/**
 * 为组件添加安装方法，使其可以通过 Vue 3 的应用程序实例进行安装
 *
 * @template T - 组件类型，必须是一个继承自 Component 的对象，并且可以有 displayName 属性
 * @param {T} component - 要添加安装方法的组件
 * @param {string} alias - 组件的别名，可选参数
 * @returns {T & Plugin} - 添加了安装方法的组件，以及符合 Vue 3 插件要求的类型
 */
export const withInstall = <T extends Component & { displayName?: string }>(
	component: T,
	alias?: string
) => {
	const comp = component as any;
	comp.install = (app: App) => {
		app.component(comp.name || comp.displayName, component);
		if (alias) {
			app.config.globalProperties[alias] = component;
		}
	};
	return component as T & Plugin;
};
