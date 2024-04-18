import VXETable from 'vxe-table';
import Operate from './src/operate.vue';

// 创建一个简单的超链接渲染
VXETable.renderer.add('$lt-cell-operate', {
	// 默认显示模板
	renderDefault({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<Operate {...props} {...attrs} {...events} params={params}></Operate>
		);
	},
});
