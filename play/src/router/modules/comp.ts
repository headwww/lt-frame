import { LAYOUT, LtRouteRecordRaw } from '@lt-frame/version-1';

const comps: LtRouteRecordRaw = {
	path: '/component',
	name: 'Component',
	component: LAYOUT,
	redirect: '/component/icon',
	meta: {
		orderNo: 100,
		icon: 'iconamoon:component',
		title: '组件',
	},
	children: [
		{
			path: 'test',
			name: 'Test',

			component: () => import('../../demo/test/index.vue'),
			meta: {
				title: '测试',
			},
		},
		{
			path: 'icon',
			name: 'IconCopm',
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: '图标',
			},
		},
		{
			path: 'transition',
			name: 'Transition',
			component: () => import('../../demo/transition/index.vue'),
			meta: {
				title: '动画组件',
			},
		},
		{
			path: 'page',
			name: 'pageDemo',
			component: () => import('../../demo/page/index.vue'),
			meta: {
				title: 'page',
			},
		},
		{
			path: 'loading',
			name: 'Loading',
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: 'loading',
			},
		},
		{
			path: 'table',
			name: 'Table',
			redirect: '/component/table/tableDemo',
			meta: {
				title: 'Table',
			},
			children: [
				{
					path: 'tableDemo',
					name: 'TableDemo',
					component: () => import('../../demo/table/index.vue'),
					meta: {
						title: '表格',
					},
				},
				{
					path: 'tableTree',
					name: 'TableTree',
					component: () => import('../../demo/table/tree.vue'),
					meta: {
						title: '公司维护',
					},
				},
				{
					path: 'danbiao',
					name: 'Danbiao',
					component: () => import('../../demo/table/danbiao.vue'),
					meta: {
						title: '币别',
					},
				},
			],
		},
		{
			path: 'split-pane',
			name: 'SplitPane',
			component: () => import('../../demo/split-pane/index.vue'),
			meta: {
				title: '分割窗体',
			},
		},
		{
			path: 'modal',
			name: 'Modal',
			component: () => import('../../demo/modal/index.vue'),
			meta: {
				title: 'Modal',
			},
		},
		{
			path: 'context',
			name: 'Context',
			component: () => import('../../demo/context-menu/index.vue'),
			meta: {
				title: '右键菜单',
			},
		},
		{
			path: 'drawer',
			name: 'Drawer',
			component: () => import('../../demo/drawer/index.vue'),
			meta: {
				title: 'Drawer',
			},
		},
		{
			path: 'useMessage',
			name: 'useMessage',
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: '反馈组件',
			},
		},
		{
			path: 'descriptions',
			name: 'Descriptions',
			component: () => import('../../demo/description/index.vue'),
			meta: {
				title: 'Descriptions',
			},
		},
		{
			path: 'tree',
			name: 'Tree',
			component: () => import('../../demo/tree/index.vue'),
			meta: {
				title: '树形控件',
			},
		},
		{
			path: 'scroll',
			name: 'ScrollView',
			redirect: '/component/scroll/scrollBar',
			meta: {
				title: '滚动组件',
			},
			children: [
				{
					path: 'scrollBar',
					name: 'ScrollBar',
					component: () => import('../../demo/scroll/index.vue'),
					meta: {
						title: 'LtscrollBar',
					},
				},
				{
					path: 'virtualScroller',
					name: 'VirtualScroller',
					component: () => import('../../demo/virtual/index.vue'),
					meta: {
						title: '虚拟滚动',
					},
				},
			],
		},
		{
			path: 'form',
			name: 'Form',
			redirect: '/component/form/baseform',
			meta: {
				title: '表单',
			},
			children: [
				{
					path: 'baseform',
					name: 'BaseForm',
					component: () => import('../../demo/form/index.vue'),
					meta: {
						title: '基础表单',
					},
				},
				{
					path: 'useform',
					name: 'Useform',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: 'UseForm',
					},
				},
				{
					path: 'refform',
					name: 'RefForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: 'RefForm',
					},
				},
				{
					path: 'advancedForm',
					name: 'AdvancedForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: '可折叠表单',
					},
				},
				{
					path: 'ruleForm',
					name: 'RuleForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: '表单验证',
					},
				},
				{
					path: 'dynamicForm',
					name: 'DynamicForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: '动态表单',
					},
				},
				{
					path: 'appendForm',
					name: 'AppendForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: '表单增删示例',
					},
				},
				{
					path: 'customForm',
					name: 'CustomForm',
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: '自定义表单控件',
					},
				},
			],
		},
	],
};

export default comps;
