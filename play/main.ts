import { createApp } from 'vue';
// import { useNamespace } from '@lt-frame/hooks';
import App from './App.vue';

import '@lt-frame/theme-chalk/src/index.scss';
import 'virtual:svg-icons-register';

// const ns = useNamespace('arrow');

const app = createApp(App);

app.mount('#app');
