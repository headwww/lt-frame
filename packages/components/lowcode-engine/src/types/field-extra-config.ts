export interface PublicTypeFieldExtraProps {
	/**
	 * 是否必填参数
	 */
	isRequired?: boolean;

	/**
	 * 默认值
	 */
	defaultValue?: any;

	/**
	 * 展示模式
	 */
	display?: 'accordion' | 'inline' | 'block';
}
