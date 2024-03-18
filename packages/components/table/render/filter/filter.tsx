import { VXETable } from 'vxe-table';
import FilterDeep from './filter-deep.vue';

VXETable.renderer.add('Filter-Deep', {
	showFilterFooter: false,
	renderFilter(_renderOpts, params) {
		return <FilterDeep key={params.column.field} params={params}></FilterDeep>;
	},
});
