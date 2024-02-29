import { createApp } from 'vue';
import { router } from './src/router';
import App from './App.vue';
import 'lt-frame/theme-chalk/index.css';

// import '@lt-frame/theme-chalk/src/index.scss';

import 'virtual:svg-icons-register';

const app = createApp(App);
async function setupApp() {
	// await setupRouter(app);
	app.use(router);
	app.mount('#app');
}

setupApp();
