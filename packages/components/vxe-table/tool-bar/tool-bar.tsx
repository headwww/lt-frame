import { VxeUI } from 'vxe-table';
import ToolFunction from './src/tool-function.vue';
import ToolBusiness from './src/tool-business.vue';

// 创建一个简单的工具栏-左侧按钮渲染
VxeUI.renderer.add('$lt-tool-function', {
	renderToolbarButton({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<ToolFunction
				{...props}
				{...attrs}
				{...events}
				params={params}
			></ToolFunction>
		);
	},
});

VxeUI.renderer.add('$lt-tool-business', {
	renderToolbarTool({ props = {}, attrs = {}, events = {} }, params) {
		return (
			<ToolBusiness
				{...props}
				{...attrs}
				{...events}
				params={params}
			></ToolBusiness>
		);
	},
});
