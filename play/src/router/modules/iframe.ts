import { IFRAME, LAYOUT, LTRouteRecordRaw } from 'lt-frame';

const about: LTRouteRecordRaw = {
	path: '/frame',
	name: 'Frame',
	component: LAYOUT,
	redirect: '/system/index',
	meta: {
		title: '外部页面',
		icon: 'eos-icons:system-ok-outlined',
		orderNo: 2000,
	},
	children: [
		{
			path: 'antv',
			name: 'Antv',
			component: IFRAME,
			meta: {
				frameSrc: 'https://next.antdv.com/components/overview',
				title: 'antv',
			},
		},
		{
			path: 'vxetable',
			name: 'VXE',
			component: IFRAME,
			meta: {
				frameSrc: 'https://vxetable.cn/#/table/start/install',
				title: 'vxe-table',
			},
		},
		{
			path: 'https://next.antdv.com/components/overview',
			name: 'DocExternal',
			component: IFRAME,
			meta: {
				title: '外链外部地址',
			},
		},
		{
			path: 'http://192.168.1.145:8016/WebReport/ReportServer;jsessionid=node0-187ce6ngilzdufknqo2aylcs26.node0?reportlet=tfcw/WorkShopUtilizationRate.cpt',
			name: 'baobiao',
			component: IFRAME,
			meta: {
				// frameSrc:
				// 'http://192.168.1.145:8016/WebReport/ReportServer;jsessionid=node0-187ce6ngilzdufknqo2aylcs26.node0?reportlet=tfcw/WorkShopUtilizationRate.cpt',
				title: '报表',
			},
		},
	],
};

export default about;
