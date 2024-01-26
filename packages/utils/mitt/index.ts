import type { RouteLocationNormalized } from 'vue-router';
import mitt from 'mitt';
import { getRawRoute } from '../vue';

/**
 *  使用mitt库提供的事件处理机制（订阅和发布事件）实现路由变化的订阅和发布。
 *  在路由守卫中触发事件，在需要监听路由改变的地方订阅如 Tab,Menu
 */
// 定义事件类型，包含名为 "routerChange" 的事件和对应的参数类型
type Events = {
	[key: symbol]: RouteLocationNormalized;
};

// 创建事件中心实例
const emitter = mitt<Events>();

// 存储最后一次路由变化的信息。它用于记录最近一次触发路由变化事件时的路由信息，以便在订阅事件时进行初始回调
let lastChangeTab: RouteLocationNormalized;

const key = Symbol('mitt-router');

/**
 * 触发事件
 * @param lastChangeRoute
 */
export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
	const r = getRawRoute(lastChangeRoute);
	emitter.emit(key, r);
	lastChangeTab = r;
}

/**
 * 订阅事件
 * @param callback 订阅的内容
 * @param immediate 订阅的开关
 */
export function listenerRouteChange(
	callback: (route: RouteLocationNormalized) => void,
	immediate = true
) {
	emitter.on(key, callback);
	immediate && lastChangeTab && callback(lastChangeTab);
}

/**
 * 清除所有事件监听器
 */
export function removeTabChangeListener() {
	emitter.all.clear();
}
