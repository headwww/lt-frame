import { createApp } from 'vue';
import App from './App.vue';

import '@lt-frame/theme-chalk/src/index.scss';
// import 'lt-frame/theme-chalk/index.css';

import 'virtual:svg-icons-register';

import { onCreate } from './src/application';

const app = createApp(App);

onCreate(app);

app.mount('#app');
