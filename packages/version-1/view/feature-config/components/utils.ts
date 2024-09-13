import { Rule } from 'ant-design-vue/es/form';

import { FeatureConfig } from '../../../types';
import { LtRouteRecordRaw, IFRAME, LAYOUT } from '../../../router';
import { componentInfoMap } from '../../../configs';

export function convertToKebabCase(str: string) {
	return str
		.replace(/([A-Z])/g, '-$1') // 在大写字母前添加 -
		.toLowerCase()
		.replace(/^-/, ''); // 将整个字符串转换为小写
}

export const validatorPath = async (_rule: Rule, value: string) => {
	const chineseRegex = /[\u4e00-\u9fa5]/;
	if (chineseRegex.test(value)) {
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject('禁止输入中文');
	}
	return Promise.resolve();
};

export const validatorURL = async (_rule: Rule, value: string) => {
	const chineseRegex = /^(http:\/\/|https:\/\/)/;
	if (!chineseRegex.test(value)) {
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject('请填写 HTTP 或 HTTPS 地址');
	}
	return Promise.resolve();
};

export const validatorSpecialChars = async (_rule: Rule, value: string) => {
	// eslint-disable-next-line no-useless-escape
	const regex = /[\\/%@#&*()^]/;
	if (regex.test(value)) {
		// eslint-disable-next-line prefer-promise-reject-errors
		return Promise.reject('存在限制字符');
	}
	return Promise.resolve();
};

export function generateRoutes(
	features: FeatureConfig[],
	parentName = '',
	parentPath = '',

	level = 0
) {
	return features.map((item) => {
		const name = parentName + item.path;
		const path = parentPath + (parentPath ? '/' : '') + item.path; // 组合父路径和当前路径

		const route = {
			name,
			meta: {
				title: item.title ? item.title : '',
				orderNo: item.orderNo,
			},
		} as LtRouteRecordRaw;

		if (item.type !== 'link') {
			route.path = level === 0 ? `/${item.path}` : item.path!!;
		} else {
			if (item.isExternalLink) {
				route.path = item.frameSrc!!;
			} else {
				route.path = item.path!!;
				route.meta.frameSrc = item.frameSrc;
			}
			route.component = IFRAME;
		}

		if (level === 0 && item.icon) {
			route.meta.icon = item.icon;
		}

		if (item.component) {
			if (componentInfoMap[item.component]) {
				route.component = componentInfoMap[item.component].component;
			}
		} else if (item.type === 'group' && level === 0) {
			route.component = LAYOUT;
		}
		if (item.children && item.children.length > 0) {
			route.children = generateRoutes(item.children, name, path, level + 1);

			// 如果是 group 类型，设置 redirect 到完整的第一个子节点路径
			if (item.type === 'group') {
				const firstChild = route.children[0];
				if (firstChild) {
					route.redirect = `/${getFullPath(firstChild, path)}`;
				}
			}
		}
		return route;
	});
}

// 辅助函数：获取完整的第一个子节点路径
function getFullPath(route: LtRouteRecordRaw, parentPath: string): string {
	if (route.children && route.children.length > 0) {
		return `${parentPath}/${route.path}/${getFullPath(
			route.children[0],
			`${parentPath}/${route.path}`
		)}`;
	}
	return `${parentPath}/${route.path}`;
}
