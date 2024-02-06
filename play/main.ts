import { createApp } from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import App from './App.vue';
import '@lt-frame/theme-chalk/src/index.scss';
import 'virtual:svg-icons-register';

const ns = useNamespace('arrow');
console.log(ns.b());
console.log(ns.e('active'));

const app = createApp(App);

app.mount('#app');
