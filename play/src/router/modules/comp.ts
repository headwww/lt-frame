import { LAYOUT, LTRouteRecordRaw } from '@lt-frame/version-1';

const comps: LTRouteRecordRaw = {
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
			path: 'icon',
			name: 'IconCopm',
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: '图标',
			},
		},
		{
			path: 'page',
			name: 'pageDemo',
			component: () => import('../../demo/icon/index.vue'),
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
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: 'Table',
			},
		},
		{
			path: 'modal',
			name: 'Modal',
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: 'Modal',
			},
		},
		{
			path: 'drawer',
			name: 'Drawer',
			component: () => import('../../demo/icon/index.vue'),
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
			component: () => import('../../demo/icon/index.vue'),
			meta: {
				title: 'Descriptions',
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
					component: () => import('../../demo/icon/index.vue'),
					meta: {
						title: 'LTscrollBar',
					},
				},
				{
					path: 'virtualScroller',
					name: 'VirtualScroller',
					component: () => import('../../demo/icon/index.vue'),
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
					component: () => import('../../demo/icon/index.vue'),
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