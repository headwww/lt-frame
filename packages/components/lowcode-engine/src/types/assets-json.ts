import { PublicTypeComponentMetadata } from './component-metadata';

/**
 * 低代码平台资产包协议
 */
export interface PublicTypeAssetsJson {
	/**
	 * 资产包协议版本号
	 */
	version: string;
	/**
	 * 所有组件的描述协议列表所有组件的列表
	 */
	components: Array<PublicTypeComponentMetadata>;
}
