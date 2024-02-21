<template>
	<a-alert style="margin: 10px 0" message="基础使用" />
	<a-button type="primary" @click="openDrawerLoading"> 打开Drawer </a-button>
	<a-alert style="margin: 10px 0" message="内外同时控制显示隐藏" />
	<a-button type="primary" @click="openDrawer2(true)"> 打开Drawer </a-button>
	<a-alert style="margin: 10px 0" message="自适应高度/显示footer" />
	<a-button type="primary" @click="openDrawer3(true)"> 打开Drawer </a-button>
	<a-alert style="margin: 10px 0" message="内外数据交互" />
	<a-button type="primary" @click="send()"> 打开Drawer </a-button>
	<a-alert style="margin: 10px 0" message="详情页模式" />
	<a-button type="primary" @click="openDrawer5(true)"> 打开Drawer </a-button>

	<Drawer1 @register="register1"> </Drawer1>
	<Drawer2 @register="register2"></Drawer2>
	<Drawer3 @register="register3"></Drawer3>
	<Drawer4 @register="register4" />
	<Drawer5 @register="register5" />
</template>

<script lang="ts" setup>
import { Alert as AAlert, Button as AButton } from 'ant-design-vue';
import { useDrawer } from '@lt-frame/hooks';
import Drawer1 from './Drawer1.vue';
import Drawer2 from './Drawer2.vue';
import Drawer3 from './Drawer3.vue';
import Drawer4 from './Drawer4.vue';
import Drawer5 from './Drawer5.vue';

const [register1, { openDrawer: openDrawer1, setDrawerProps }] = useDrawer();
const [register2, { openDrawer: openDrawer2 }] = useDrawer();
const [register3, { openDrawer: openDrawer3 }] = useDrawer();
const [register4, { openDrawer: openDrawer4 }] = useDrawer();
const [register5, { openDrawer: openDrawer5 }] = useDrawer();
function send() {
	openDrawer4(true, {
		data: 'content',
		info: 'Info',
	});
}
function openDrawerLoading() {
	openDrawer1();
	setDrawerProps({ loading: true });
	setTimeout(() => {
		setDrawerProps({ loading: false });
	}, 2000);
}
</script>
