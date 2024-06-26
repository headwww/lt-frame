import { LtSetterRender } from '@lt-frame/components';
import { Recordable } from '@lt-frame/utils';
import { h } from 'vue';
import FieldSetter from './components/field-setter.vue';
import VariableSetter from './components/variable-setter.vue';
import LtTable from './material/table.vue';

LtSetterRender.renderer.add('FieldSetter', {
	createSetterContent(props: Recordable) {
		return h(FieldSetter, { ...props });
	},
});

LtSetterRender.renderer.add('VariableSetter', {
	createSetterContent(props: Recordable) {
		return h(VariableSetter, { ...props });
	},
});

export const LtConfigTable = LtTable;
