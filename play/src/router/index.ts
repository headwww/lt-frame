import { LTRouteRecordRaw } from '@lt-frame/version-1';

const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: LTRouteRecordRaw[] = [];

Object.keys(modules).forEach((key) => {
	const mod = (modules as Record<string, any>)[key].default || {};
	const modList = Array.isArray(mod) ? [...mod] : [mod];
	routeModuleList.push(...modList);
});

export const asyncRoutes = [...routeModuleList];
