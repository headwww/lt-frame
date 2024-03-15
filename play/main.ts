import { createApp } from 'vue';
import { withInstall } from '@lt-frame/utils';
import { LTDrawer, LTLoading } from '@lt-frame/components';
import App from './App.vue';
// import { onCreate } from './src/application';
// import '@lt-frame/theme-chalk/src/index.scss';
import 'lt-frame/theme-chalk/index.css';

import 'virtual:svg-icons-register';
import 'vxe-table/lib/style.css';

withInstall(LTLoading);
withInstall(LTDrawer);

const app = createApp(App);

// onCreate(app);

app.mount('#app');
