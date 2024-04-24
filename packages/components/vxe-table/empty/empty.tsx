import { VXETable } from 'vxe-table';
import { Empty } from 'ant-design-vue';

VXETable.renderer.add('$lt-empty', {
	renderEmpty(_renderOpts, params) {
		if (params.$table.getTableData().fullData.length !== 0) {
			return <span></span>;
		}
		return <Empty style="margin-top: 20px"></Empty>;
	},
});

VXETable.renderer.add('$lt-default-empty', {
	renderEmpty() {
		return <span>暂无数据</span>;
	},
});
