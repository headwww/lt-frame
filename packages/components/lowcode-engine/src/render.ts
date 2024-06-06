import { Recordable } from '@lt-frame/utils';
import { VNode, h } from 'vue';
import XEUtils from 'xe-utils';
import BoolSetter from './components/bool-setter.vue';
import NumberSetter from './components/number-setter.vue';
import RadioGroupSetter from './components/radio-group-setter.vue';
import SelectSetter from './components/select-setter.vue';
import StringSetter from './components/string-setter.vue';
import { ObjectSetter } from './components/object-setter';
import { ArraySetter } from './components/array-setter';
import TextSetter from './components/text-setter.vue';
import FieldSetter from './components/field-setter.vue';
import JsonSetter from './components/json-setter.vue';

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
	FieldSetter: {
		createSetterContent(props: Recordable) {
			return h(FieldSetter, { ...props });
		},
	},
	JsonSetter: {
		createSetterContent(props: Recordable) {
			return h(JsonSetter, { ...props });
		},
	},
};

type RendererOptions = DefineRendererOption<VNode | VNode[]>;

interface Renderer {
	mixin(options: { [name: string]: RendererOptions }): Renderer;
	get(name: string | null | undefined): RendererOptions;
	add(name: string, options: RendererOptions): Renderer;
	delete(name: string): void;
}

interface DefineRendererOption<T> {
	createSetterContent?(props: Recordable): T;
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
};

export const LtSetterRender = {
	renderer,
};
