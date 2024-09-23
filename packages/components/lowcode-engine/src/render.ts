import { Recordable } from '@lt-frame/utils';
import { VNode, h } from 'vue';
import XEUtils from 'xe-utils';
import BoolSetter from './setters/bool-setter.vue';
import NumberSetter from './setters/number-setter.vue';
import RadioGroupSetter from './setters/radio-group-setter.vue';
import SelectSetter from './setters/select-setter.vue';
import StringSetter from './setters/string-setter.vue';
import { ObjectSetter } from './setters/object-setter';
import { ArraySetter } from './setters/array-setter';
import TextSetter from './setters/text-setter.vue';
import JsonSetter from './setters/json-setter.vue';
import InputMaterial from './materials/input-material.vue';
import PageMaterial from './materials/page-material.vue';
import ButtonMaterial from './materials/button-material.vue';
/**
 * 内置的设置器
 */
const setterMap: Recordable = {
	BoolSetter: {
		createSetterContent(props: Recordable) {
			return h(BoolSetter, { ...props });
		},
	},
	NumberSetter: {
		createSetterContent(props: Recordable) {
			return h(NumberSetter, { ...props });
		},
	},
	RadioGroupSetter: {
		createSetterContent(props: Recordable) {
			return h(RadioGroupSetter, { ...props });
		},
	},
	SelectSetter: {
		createSetterContent(props: Recordable) {
			return h(SelectSetter, { ...props });
		},
	},
	StringSetter: {
		createSetterContent(props: Recordable) {
			return h(StringSetter, { ...props });
		},
	},
	ObjectSetter: {
		createSetterContent(props: Recordable) {
			return h(ObjectSetter, { ...props });
		},
	},
	ArraySetter: {
		createSetterContent(props: Recordable) {
			return h(ArraySetter, { ...props });
		},
	},
	TextSetter: {
		createSetterContent(props: Recordable) {
			return h(TextSetter, { ...props });
		},
	},
	JsonSetter: {
		createSetterContent(props: Recordable) {
			return h(JsonSetter, { ...props });
		},
	},
	Input: {
		createMaterial(props: Recordable) {
			return h(InputMaterial, { ...props });
		},
	},
	Button: {
		createMaterial(props: Recordable) {
			return h(ButtonMaterial, { ...props });
		},
	},
	Page: {
		createMaterial(props: Recordable) {
			return h(PageMaterial, { ...props });
		},
	},
};

type RendererOptions = DefineRendererOption<VNode | VNode[]>;

interface Renderer {
	mixin(options: { [name: string]: RendererOptions }): Renderer;
	get(name: string | null | undefined): RendererOptions;
	add(name: string, options: RendererOptions): Renderer;
	delete(name: string): void;
	getStore(): any;
}

interface DefineRendererOption<T> {
	// 创建设置器
	createSetterContent?(props: Recordable): T;
	// 创建物料
	createMaterial?(props: Recordable): T;
}

const renderer: Renderer = {
	mixin(opts) {
		XEUtils.each(opts, (options, name) => renderer.add(name, options));
		return renderer;
	},
	get(name: string) {
		return setterMap[name] || null;
	},
	add(name, options) {
		if (name && options) {
			const renders = setterMap[name];
			if (renders) {
				Object.assign(renders, options);
			} else {
				setterMap[name] = options;
			}
		}
		return renderer;
	},
	delete(name) {
		delete setterMap[name];
		return renderer;
	},
	getStore() {
		return setterMap;
	},
};

export const LtLowCodeRender = {
	renderer,
};
