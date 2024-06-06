import { ISettingTopEntry } from './setting-top-entry';
import { ISettingPropEntry, SettingPropEntry } from './setting-prop-entry';
import { IPublicTypeFieldConfig } from './field-config';
import { IPublicTypeSetterType } from './setter-config';
import { IPublicTypeFieldExtraProps } from './field-extra-props';
import { IPublicTypeTitleContent } from './title-config';

export interface ISettingField extends ISettingPropEntry {
	get items(): Array<ISettingField>;
	get setter(): IPublicTypeSetterType | null;
	get title(): IPublicTypeTitleContent | undefined;
	createField(config: IPublicTypeFieldConfig): ISettingField;
	extraProps: IPublicTypeFieldExtraProps;
	setValue(val: any): void;
}

export class SettingField extends SettingPropEntry implements ISettingField {
	private _config: IPublicTypeFieldConfig;

	private _items: Array<ISettingField> = [];

	private _setter?: IPublicTypeSetterType;

	extraProps: IPublicTypeFieldExtraProps;

	private _title?: IPublicTypeTitleContent;

	constructor(
		parent: ISettingTopEntry | ISettingField,
		config: IPublicTypeFieldConfig
	) {
		super(parent, config.name, config.type);

		const { items, setter, title, extraProps, ...rest } = config;
		this._config = config;
		this._setter = setter;
		this._title = title;
		this.extraProps = {
			...rest,
			...extraProps,
		};
		if (items && items.length > 0) {
			this.initItems(items);
		}
	}

	private initItems(items: Array<IPublicTypeFieldConfig>) {
		this._items = items.map((item) => new SettingField(this, item));
	}

	// 创建子配置项，通常用于 object/array 类型数据
	createField(config: IPublicTypeFieldConfig): ISettingField {
		return new SettingField(this, config);
	}

	get title() {
		return this._title;
	}

	get items(): ISettingField[] {
		return this._items;
	}

	get setter(): IPublicTypeSetterType | null {
		if (!this._setter) {
			return null;
		}
		return this._setter;
	}

	setValue(val: any) {
		super.setValue(val);
	}

	get config(): IPublicTypeFieldConfig {
		return this._config;
	}
}
