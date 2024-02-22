import { createApp } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import App from './App.vue';

import '@lt-frame/theme-chalk/src/index.scss';
import 'virtual:svg-icons-register';

const ns = useNamespace('page-layout');

console.log(ns.m('dense'), process.env.NODE_ENV);

const app = createApp(App);

app.mount('#app');
