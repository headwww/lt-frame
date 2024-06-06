import { createApp } from 'vue';
import App from './App.vue';
import { onCreate } from './src/application';

import '@lt-frame/theme-chalk/src/index.scss';
import 'virtual:svg-icons-register';
import 'vxe-table/lib/style.css';
import 'jsoneditor/dist/jsoneditor.css';
import 'uno.css';

const app = createApp(App);

onCreate(app);
app.mount('#app');
