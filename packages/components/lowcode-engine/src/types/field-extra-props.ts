import { ISettingField } from './setting-field';
import { ISettingPropEntry } from './setting-prop-entry';

/**
 * extra props for field
 */
export interface IPublicTypeFieldExtraProps {
	/**
	 * 是否必填参数
	 */
	isRequired?: boolean;

	/**
	 * default value of target prop for setter use
	 */
	defaultValue?: any;

	setValue?: (target: ISettingField | ISettingPropEntry, value: any) => void;

	condition?: (target: ISettingField) => boolean;

	display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';

	/**
	 * internal use
	 */
	forceInline?: number;
}
