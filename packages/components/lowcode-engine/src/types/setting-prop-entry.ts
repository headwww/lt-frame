import { uniqueId } from 'lodash-es';
import { ISettingEntry } from './setting-entry-type';
import { ISettingField } from './setting-field';
import { ISettingTopEntry } from './setting-top-entry';
import { IPublicTypeFieldExtraProps } from './field-extra-props';

export interface ISettingPropEntry extends ISettingEntry {
	readonly isGroup: boolean;
	get name(): string | number | undefined;
	readonly top: ISettingTopEntry;
	getProps(): ISettingTopEntry;
	getValue: () => any;
	getPropValue(propName: any): any;
	setValue(val: any): void;
	setPropValue: (propName: any, value: any) => void;
	setName: (name: any) => void;
	readonly path: Array<string | number | undefined>;
}

export class SettingPropEntry implements ISettingPropEntry {
	readonly id = uniqueId('entry');

	readonly type: 'field' | 'group';

	private _name: string | number | undefined;

	readonly isGroup: boolean;

	readonly top: ISettingTopEntry;

	extraProps: IPublicTypeFieldExtraProps = {};

	constructor(
		readonly parent: ISettingTopEntry | ISettingField,
		name: string | number | undefined,
		type?: 'field' | 'group'
	) {
		if (type == null) {
			this.type = 'field';
		} else {
			this.type = type;
		}
		this._name = name;

		this.isGroup = this.type === 'group';
		this.top = parent.top;
	}

	setValue(val: any): void {
		this.parent.setPropValue(this.name, val);
		const { setValue } = this.extraProps;
		if (setValue) {
			setValue(this, val);
		}
	}

	get path() {
		const path = this.parent.path.slice();
		if (this.type === 'field' && this.name?.toString()) {
			path.push(this.name);
		}
		return path;
	}

	/**
	 * 设置子级属性值
	 */
	setPropValue(propName: any, value: any) {
		const path = this.path.concat(propName).join('.');
		this.top.setPropValue(path, value);
	}

	getProps(): ISettingTopEntry {
		return this.top;
	}

	get name(): string | number | undefined {
		return this._name;
	}

	setName(name: any) {
		this._name = name;
	}

	/**
	 * 获取当前属性值
	 */
	getValue(): any {
		const val = this.parent.getPropValue(this.name);
		return val;
	}

	/**
	 * 获取子级属性值
	 */
	getPropValue(propName: string | number): any {
		return this.top.getPropValue(this.path.concat(propName).join('.'));
	}
}
