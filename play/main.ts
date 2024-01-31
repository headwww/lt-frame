import { createApp } from 'vue';
import App from './App.vue';
import '@lt-frame/theme-chalk/dist/index.css';
// import 'lt-frame/dist/index.css';
import 'virtual:svg-icons-register';

const app = createApp(App);

app.mount('#app');
