/**
 * 描述 props 的 setter title
 */
export interface IPublicTypeTitleConfig {
	/**
	 * 文字描述
	 */
	label?: string;

	/**
	 * hover 后的展现内容
	 */
	tip?: string;
}

export type IPublicTypeTitleContent = string | IPublicTypeTitleConfig;
