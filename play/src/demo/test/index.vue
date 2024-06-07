<template>
	<div>{{ a }}</div>
	<button @click="eventBus['one']()">11</button>
	<button @click="executeCode(state)">22</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const a = ref(1);

const state = {
	a,
};
const eventBus = {
	one: () => {
		a.value++;
	},
	tow: () => {
		console.log(a.value);
		return a.value !== 2;
	},
};

state;

const code = 'state.a.value = 30'; // 这里可以放任意的代码
// eslint-disable-next-line no-new-func
const executeCode = new Function('state', code);
</script>
