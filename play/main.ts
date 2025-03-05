/*
 * @Author: shuwen 1243889238@qq.com
 * @Date: 2024-03-13 16:55:00
 * @LastEditors: shuwen 1243889238@qq.com
 * @LastEditTime: 2025-03-05 19:11:59
 * @FilePath: /lt-frame/play/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue';
import App from './App.vue';
import { onCreate } from './src/application';

import '@lt-frame/theme-chalk/src/index.scss';
import 'virtual:svg-icons-register';
import 'vxe-table/lib/style.css';
import 'vxe-pc-ui/lib/style.css';
import 'jsoneditor/dist/jsoneditor.css';
import 'uno.css';

const app = createApp(App);

onCreate(app);
app.mount('#app');
