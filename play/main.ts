import { createApp } from 'vue';
import { isArray } from 'lt-frame';
import App from './App.vue';

isArray([]);
const app = createApp(App);

app.mount('#app');
