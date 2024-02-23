import { createApp } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import App from './App.vue';

import '@lt-frame/theme-chalk/src/index.scss';

import 'virtual:svg-icons-register';

const ns = useNamespace('modal-close');

console.log(ns.b(), ns.m('custom'), ns.m('can-full'));

const app = createApp(App);

app.mount('#app');
