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

type NestedObject = { [key: string]: any };

function convertToNestedObject(flatObj: Record<string, any>): NestedObject {
	const result: NestedObject = {};

	for (const [key, value] of Object.entries(flatObj)) {
		const parts = key.split('.');
		let current = result;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];

			if (i === parts.length - 1) {
				// 最后一个部分直接赋值
				current[part] = value;
			} else {
				// 确保中间路径是对象
				if (!current[part] || typeof current[part] !== 'object') {
					current[part] = {};
				}
				current = current[part];
			}
		}
	}

	return result;
}

// 使用示例
const flatData = {
	name: '测试属性',
	'parent.id': 888888,
	'parent.name': '测试属性2',
	'parent.obj.name': 18,
	'parent.obj.ddd': 18,
	'parent.cc.ddd': 18,
	aaa: undefined,
	acs: null,
	parent1: {
		ccc: null,
	},
	$_checked: null,
	_X_ROW_KEY: 'row_150',
};

const nestedData = convertToNestedObject(flatData);
console.log(nestedData);
/* 输出：
{
  name: "测试属性",
  parent: { id: 888888 },
  $_checked: null,
  _X_ROW_KEY: "row_150"
}
*/
