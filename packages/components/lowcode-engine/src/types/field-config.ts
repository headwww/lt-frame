import { IPublicTypeFieldExtraProps } from './field-extra-props';
import { IPublicTypeSetterType } from './setter-config';
import { IPublicTypeTitleContent } from './title-config';

/**
 * 属性面板配置
 */
export interface IPublicTypeFieldConfig extends IPublicTypeFieldExtraProps {
	type?: 'field' | 'group';

	name?: string | number;

	title?: IPublicTypeTitleContent;

	setter?: IPublicTypeSetterType;

	items?: IPublicTypeFieldConfig[];

	extraProps?: IPublicTypeFieldExtraProps;
}
