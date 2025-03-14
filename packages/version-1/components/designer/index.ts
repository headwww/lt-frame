import { LtLowCodeRender } from '@lt-frame/components';
import { Recordable } from '@lt-frame/utils';
import { h } from 'vue';
import FieldSetter from './components/field-setter.vue';
import VariableSetter from './components/variable-setter.vue';
import SQLSetter from './components/sql-setter.vue';
import FunctionSetter from './components/function-setter.vue';
import LtTable from './material/table.vue';

LtLowCodeRender.renderer.add('FieldSetter', {
	createSetterContent(props: Recordable) {
		return h(FieldSetter, { ...props });
	},
});

LtLowCodeRender.renderer.add('VariableSetter', {
	createSetterContent(props: Recordable) {
		return h(VariableSetter, { ...props });
	},
});

LtLowCodeRender.renderer.add('SQLSetter', {
	createSetterContent(props: Recordable) {
		return h(SQLSetter, { ...props });
	},
});

LtLowCodeRender.renderer.add('FunctionSetter', {
	createSetterContent(props: Recordable) {
		return h(FunctionSetter, { ...props });
	},
});

export const LtConfigTable = LtTable;
export type { TableQueryParams } from './material/table';
export { showAttachment } from './components/modal-attachment';
