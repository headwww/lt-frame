import { isObject } from 'lodash-es';
import { IPublicTypeTitleContent } from './title-config';

/**
 * 设置器配置
 */
export interface IPublicTypeSetterConfig {
	// if *string* passed must be a registered Setter Name
	/**
	 * 配置设置器用哪一个 setter
	 */
	componentName: string;

	/**
	 * 传递给 setter 的属性
	 *
	 * the props pass to Setter Component
	 */
	props?: Record<string, unknown>;

	/**
	 * @deprecated
	 */
	children?: any;

	/**
	 * 是否必填？
	 *
	 * ArraySetter 里有个快捷预览，可以在不打开面板的情况下直接编辑
	 */
	isRequired?: boolean;

	/**
	 * Setter 的初始值
	 *
	 * @todo initialValue 可能要和 defaultValue 二选一
	 */
	initialValue?: any;

	defaultValue?: any;

	// for MixedSetter
	/**
	 * 给 MixedSetter 时切换 Setter 展示用的
	 */
	title?: IPublicTypeTitleContent;
}

export type IPublicTypeSetterType =
	| IPublicTypeSetterConfig
	| IPublicTypeSetterConfig[]
	| string;

export function isSetterConfig(obj: any): obj is IPublicTypeSetterConfig {
	if (!isObject(obj)) {
		return false;
	}
	return 'componentName' in obj;
}
