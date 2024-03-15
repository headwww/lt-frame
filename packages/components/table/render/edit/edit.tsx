import { VXETable } from 'vxe-table';
import EditInput from './edit-input.vue';
import EditInputNumber from './edit-input-number.vue';
import EditDate from './edit-date.vue';
import EditTime from './edit-time.vue';
import EditSelect from './edit-select.vue';
import EditTable from './edit-table.vue';

VXETable.renderer.add('LT-Input', {
	renderEdit(_renderOpts, params) {
		return <EditInput params={params}></EditInput>;
	},
});

VXETable.renderer.add('LT-InputNumber', {
	renderEdit(_renderOpts, params) {
		return <EditInputNumber params={params}></EditInputNumber>;
	},
});

VXETable.renderer.add('LT-Date', {
	renderEdit(_renderOpts, params) {
		return <EditDate params={params}></EditDate>;
	},
});

VXETable.renderer.add('LT-Time', {
	renderEdit(_renderOpts, params) {
		return <EditTime params={params}></EditTime>;
	},
});

VXETable.renderer.add('LT-Select', {
	renderEdit(_renderOpts, params) {
		return <EditSelect params={params}></EditSelect>;
	},
});

VXETable.renderer.add('LT-Table', {
	renderEdit(_renderOpts, params) {
		return <EditTable params={params}></EditTable>;
	},
});
