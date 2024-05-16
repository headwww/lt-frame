import { type Component } from 'vue';
import BoolSetter from './components/bool-setter.vue';
import ObjectSetter from './components/object-setter.vue';
import RadioGroupSetter from './components/radio-group-setter.vue';
import SelectSetter from './components/select-setter.vue';
import ArraySetter from './components/array-setter.vue';
import NumberSetter from './components/number-setter.vue';
import StringSetter from './components/string-setter.vue';

const componentMap = new Map<string, Component>();

componentMap.set('NumberSetter', NumberSetter);
componentMap.set('StringSetter', StringSetter);
componentMap.set('BoolSetter', BoolSetter);
componentMap.set('ObjectSetter', ObjectSetter);
componentMap.set('RadioGroupSetter', RadioGroupSetter);
componentMap.set('SelectSetter', SelectSetter);
componentMap.set('ArraySetter', ArraySetter);

export function add<T extends string, R extends Component>(
	compName: T,
	component: R
) {
	componentMap.set(compName, component);
}

export function del<T extends string>(compName: T) {
	componentMap.delete(compName);
}

export { componentMap };
