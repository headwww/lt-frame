import { Empty } from 'ant-design-vue';
import { VXETable } from 'vxe-table';

VXETable.renderer.add('LT-Empty', {
	renderEmpty(_renderOpts, params) {
		if (params.$table.getTableData().fullData.length !== 0) {
			return <span></span>;
		}
		return <Empty style="margin-top: 20px"></Empty>;
	},
});
