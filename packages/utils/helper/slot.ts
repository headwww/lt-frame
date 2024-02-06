import { Slots } from 'vue';
import { isFunction } from 'lodash-es';

export type RenderOpts = {
	disabled: boolean;
	[key: string]: any;
};

/**
 * 从Vue组件获取特定插槽的函数。
 *
 * @param slots 来自Vue组件的 'slots' 对象。
 * @param slot  要检索的插槽的名称（默认为 'default'）。
 * @param data  传递到插槽的附加数据。
 * @param opts  可选的渲染选项。
 * @returns
 */
export function getSlot(
	slots: Slots,
	// eslint-disable-next-line default-param-last
	slot = 'default',
	data?: any,
	opts?: RenderOpts
) {
	if (!slots || !Reflect.has(slots, slot)) {
		return null;
	}
	if (!isFunction(slots[slot])) {
		// eslint-disable-next-line no-console
		console.error(`${slot} is not a function!`);
		return null;
	}
	const slotFn = slots[slot];
	if (!slotFn) return null;
	const params = { ...data, ...opts };
	return slotFn(params);
}

/**
 * 通过创建一个新对象来扩展插槽的函数。
 * @param slots
 * @param excludeKeys
 * @returns
 */
export function extendSlots(slots: Slots, excludeKeys: string[] = []) {
	const slotKeys = Object.keys(slots);
	const ret: any = {};
	slotKeys.forEach((key) => {
		if (!excludeKeys.includes(key)) {
			ret[key] = (data?: any) => getSlot(slots, key, data);
		}
	});
	return ret;
}
