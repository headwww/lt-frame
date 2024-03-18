import { VXETable } from 'vxe-table';
import EditInput from './edit-input.vue';
import EditInputNumber from './edit-input-number.vue';
import EditDate from './edit-date.vue';
import EditTime from './edit-time.vue';
import EditSelect from './edit-select.vue';
import EditTable from './edit-table.vue';

VXETable.renderer.add('Edit-Input', {
	renderEdit(_renderOpts, params) {
		return <EditInput params={params}></EditInput>;
	},
});

VXETable.renderer.add('Edit-InputNumber', {
	renderEdit(_renderOpts, params) {
		return <EditInputNumber params={params}></EditInputNumber>;
	},
});

VXETable.renderer.add('Edit-Date', {
	renderEdit(_renderOpts, params) {
		return <EditDate params={params}></EditDate>;
	},
});

VXETable.renderer.add('Edit-Time', {
	renderEdit(_renderOpts, params) {
		return <EditTime params={params}></EditTime>;
	},
});

VXETable.renderer.add('Edit-Select', {
	renderEdit(_renderOpts, params) {
		return <EditSelect params={params}></EditSelect>;
	},
});

VXETable.renderer.add('Edit-Table', {
	renderEdit(_renderOpts, params) {
		return <EditTable params={params}></EditTable>;
	},
});
