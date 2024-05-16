import { PublicTypeFieldExtraProps } from './field-extra-config';

/**
 * 属性配置
 */
export interface PublicTypeFieldConfig extends PublicTypeFieldExtraProps {
	/**
	 * 面板是单个field还是一个分组
	 * 单个field在最后的产物中是直接当成一个属性放入
	 * group的情况是展开这个中的属性放入到最后的产物中
	 */
	type?: 'field' | 'group';

	/**
	 * 设置属性的名字，用与最后产物中的属性的key
	 */
	name?: string | number;

	/**
	 * 属性的title
	 */
	title?: string;

	/**
	 * 单个属性的 setter 配置
	 * 当type = field 时候生效
	 */
	setter?: any;

	/**
	 * 当type=group时生效
	 */
	items?: PublicTypeFieldConfig[];

	/**
	 * 额外的配置
	 */
	extraProps: PublicTypeFieldExtraProps;
}
