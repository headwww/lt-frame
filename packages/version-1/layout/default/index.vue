<template>
	<Layout :class="ns.b()">
		<LayoutHeader />
		<div
			style="position: relative; left: 50%; top: 49%"
			class="cut-scenes-loade"
			v-if="!initMenu"
		></div>
		<Layout :class="ns.e('sider-content')">
			<div v-if="!initMenu" :class="ns.e('sider-spin')">
				<SkeletonButton
					:size="'small'"
					active
					block
					style="padding: 15px 30px"
					v-for="item in 10"
					:key="item"
				/>
			</div>
			<LayoutSider v-else />
			<Layout :class="ns.e('content')">
				<Tabs />
				<LayoutContent v-if="initMenu" />
			</Layout>
		</Layout>
	</Layout>
</template>

<script lang="ts" setup>
import { Layout, Modal, SkeletonButton } from 'ant-design-vue';
import { useMessage, useNamespace } from '@lt-frame/hooks';
import { AxiosError } from 'axios';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouteRecordRaw, useRouter } from 'vue-router';
import { eachTree, toArrayTree } from 'xe-utils';
import { generateRoutes } from '../../view/feature-config/components/utils';
import LayoutHeader from './header/index.vue';
import Tabs from './tabs/index.vue';
import LayoutSider from './sider/index.vue';
import LayoutContent from './conent/index.vue';
import { LtHttp, getAppConfig } from '../../configs';
import { useUserStore, usePermissionStore } from '../../stores';

const ns = useNamespace('main-layout');

const userStore = useUserStore();

const permissionStore = usePermissionStore();
const { routes } = getAppConfig();
const router = useRouter();

const initMenu = ref(false);

const { createMessage } = useMessage();

onMounted(() => {
	getUserMenuList();
});

/**
 * 获取菜单请求如果请求失败提示登录失效则请求登录，
 * 登录成功则再次获取菜单，登录失败弹出原因
 *
 */
function getUserMenuList() {
	LtHttp.post(
		{
			url: 'api/bsMenuPermissionService/getUserMenuList',
			data: [],
		},
		{ errorMessageMode: 'none' }
	)
		.then(async (data) => {
			// 获取菜单成功将内置的菜单和后台配置的菜单结合生成动态路由和
			const arr = toArrayTree(data, {
				strict: true,
				parentKey: 'parentId',
				key: 'fid',
				children: 'children',
			}).sort((a, b) => (a.orderNo || 0) - (b.orderNo || 0));
			eachTree(arr, (item, index) => {
				item.orderNo = index;
			});

			const { dynamicRoutes, PAGE_NOT_FOUND_ROUTE } = routes!!;

			if (dynamicRoutes) {
				const list = [...dynamicRoutes, ...generateRoutes(arr)];
				const buildRoutes = await permissionStore.buildRoutesAction(list);
				buildRoutes.forEach((route) => {
					router.addRoute(route as unknown as RouteRecordRaw);
				});
				if (PAGE_NOT_FOUND_ROUTE) {
					router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
				}
				permissionStore.setDynamicAddedRoute(true);
				const currentRoute = router.currentRoute.value;
				router
					.replace({ path: currentRoute.fullPath, query: currentRoute.query })
					.finally(() => {
						initMenu.value = true;
					});
				startPing();
			}
		})
		.catch(() => {
			// 登录失效，重新登录
			Modal.info({
				title: '当前登录身份异常，请刷新重试',
				okText: '刷新',
				onOk() {
					login();
				},
			});
		});
}

function login() {
	const client = userStore.getClient;
	if (client) {
		LtHttp.post(
			{
				url: 'api/login',
				data: [client.user?.username, client.user?.password],
			},
			{ errorMessageMode: 'none' }
		)
			.then(() => {
				createMessage.success('连接成功');
				getUserMenuList();
			})
			.catch((e: AxiosError) => {
				// 登录失败
				Modal.confirm({
					title: `登录异常，请刷新重试`,
					content: `错误代码：${e.response?.status}，请联系管理员！`,
					okText: '刷新',
					cancelText: '回到登录页',
					cancelButtonProps: { type: 'primary', danger: true },
					onCancel() {
						userStore.confirmLoginOut();
					},
					onOk() {
						login();
					},
				});
			});
	}
}

// 定义定时器的 ID 和控制开关的变量
let pingIntervalId: any = null;
let isPingActive = false; // 开关状态，初始为关闭

// 心跳请求的函数
const sendPingRequest = async () => {
	try {
		await LtHttp.get(
			{
				url: '/ping',
			},
			{ errorMessageMode: 'none' }
		);
	} catch (e) {
		// ping失败
		const { response } = e as unknown as AxiosError;
		if (response) {
			const { status } = response;
			if (status) {
				stopPing();
				Modal.info({
					title: `登录异常，请刷新重试`,
					content: `错误代码：${status}，请联系管理员！`,
					okText: '刷新',
					onOk() {
						login();
					},
				});
			}
		}
	}
};

// 开启定时器函数
const startPing = () => {
	if (!isPingActive) {
		// 立即执行一次心跳请求
		sendPingRequest();
		// 设置定时器，每隔 15 秒执行一次心跳请求
		pingIntervalId = setInterval(sendPingRequest, 15000);
		isPingActive = true; // 开启定时器，设置状态为活动
	}
};

// 关闭定时器函数
const stopPing = () => {
	if (isPingActive && pingIntervalId !== null) {
		clearInterval(pingIntervalId); // 清除定时器
		pingIntervalId = null;
		isPingActive = false; // 关闭定时器，设置状态为非活动
	}
};

onUnmounted(() => {
	stopPing();
});
</script>
