import { LtSetterRender } from '@lt-frame/components';
import { Recordable } from '@lt-frame/utils';
import { h } from 'vue';
import FieldSetter from './components/field-setter.vue';
import designer from './designer.vue';

LtSetterRender.renderer.add('FieldSetter', {
	createSetterContent(props: Recordable) {
		return h(FieldSetter, { ...props });
	},
});

export const LtTableDesigner = designer;
