import { LAYOUT, LTRouteRecordRaw } from 'lt-frame';

const homePage: LTRouteRecordRaw = {
	path: '/home-page',
	name: 'HomePage',
	component: LAYOUT,
	redirect: '/home-page/home',
	meta: {
		hideChildrenInMenu: true,
		title: '首页',
		orderNo: 0,
		icon: 'material-symbols:home-outline',
	},
	children: [
		{
			path: 'home',
			name: 'HomePageChildren',
			component: () => import('../../demo/button/index.vue'),
			meta: {
				affix: true,
				title: '首页',
				hideMenu: true,
			},
		},
	],
};

export default homePage;
