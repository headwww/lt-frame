import { VxeUI } from 'vxe-table';
import { Empty } from 'ant-design-vue';

VxeUI.renderer.add('$lt-empty', {
	renderEmpty(_renderOpts, params) {
		if (params.$table.getTableData().fullData.length !== 0) {
			return <span></span>;
		}
		return <Empty style="margin-top: 20px"></Empty>;
	},
});

VxeUI.renderer.add('$lt-default-empty', {
	renderEmpty() {
		return <span>暂无数据</span>;
	},
});
