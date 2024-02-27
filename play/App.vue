<template>
	<LTApplication>
		<Basic></Basic>
		<Button></Button>
		<Description></Description>
		<Drawer></Drawer>
		<Dropdown></Dropdown>
		<Icon></Icon>
		<Modal></Modal>
	</LTApplication>
</template>

<script lang="ts" setup>
import { LTApplication } from 'lt-frame';
import Basic from './demo/basic/index.vue';
import Button from './demo/button/index.vue';
import Description from './demo/description/index.vue';
import Drawer from './demo/drawer/index.vue';
import Dropdown from './demo/dropdown/index.vue';
import Icon from './demo/icon/index.vue';
import Modal from './demo/modal/index.vue';
</script>
