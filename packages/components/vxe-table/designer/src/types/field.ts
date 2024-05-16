import { SetterConfig } from './setter';

/**
 * 属性配置
 */
export interface FieldConfig {
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
	title?: string | TitleConfig;

	/**
	 * 单个属性的 setter 配置
	 * 当type = field 时候生效
	 */
	setter?: string | SetterConfig | SetterConfig[];

	/**
	 * 当type=group时生效
	 */
	items?: FieldConfig[];

	/**
	 * 是否必填参数
	 */
	isRequired?: boolean;

	/**
	 * 初始化值和默认值选择使用
	 */
	initialValue?: any;
	/**
	 * 默认值
	 */
	defaultValue?: any;

	/**
	 * 展示模式
	 */
	display?: 'accordion' | 'inline' | 'block';
}

export interface TitleConfig {
	/**
	 * 文字描述
	 */
	label?: string;

	/**
	 * hover 后的展现内容
	 */
	tip?: string;

	/**
	 * 文档链接，暂未实现
	 */
	docUrl?: string;
}
