import { PublicTypeFieldConfig } from './field-config';
import { PublicTypePropConfig } from './prop-config';

/**
 * 组件 meta 配置
 */
export interface PublicTypeComponentMetadata {
	/** 其他扩展协议 */
	[key: string]: any;

	/**
	 * 组件名
	 */
	componentName: string;

	/**
	 * unique id
	 */
	uri?: string;

	/**
	 * title or description
	 */
	title?: string;

	/**
	 * 组件描述
	 */
	description?: string;

	/**
	 * 组件属性信息
	 */
	props?: PublicTypePropConfig[];

	/**
	 * 编辑体验增强
	 */
	configure?: PublicTypeFieldConfig[];
}
