import VXETable from 'vxe-table';
import Operate from './src/operate.vue';

VXETable.renderer.add('$lt-cell-operate', {
	// 默认显示模板
	renderDefault({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<Operate {...props} {...attrs} {...events} params={params}></Operate>
		);
	},
});
