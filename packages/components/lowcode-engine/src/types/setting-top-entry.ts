import { get, set } from 'lodash-es';
import { isProxy, ref, toRaw } from 'vue';
import { IPublicTypeFieldConfig } from './field-config';
import { ISettingField, SettingField } from './setting-field';

export interface ISettingTopEntry {
	readonly top: ISettingTopEntry;
	items: Array<ISettingField>;
	readonly path: never[];
	setNode: (value: any) => void;
	setPropValue: (propName: any, value: any) => void;
	getPropValue(propName: any): any;
}

export class SettingTopEntry implements ISettingTopEntry {
	private _items: Array<SettingField> = [];

	readonly top = this;

	readonly path = [];

	node: any = ref({});

	constructor(config: Array<IPublicTypeFieldConfig>, node?: any) {
		this._items = config.map((item) => new SettingField(this, item));
		this.node.value = node || {};
	}

	get items() {
		return this._items;
	}

	/**
	 * 设置子级属性值
	 */
	setPropValue(propName: any, value: any) {
		if (isProxy(this)) {
			set(toRaw(this).node.value, propName, value);
		} else {
			set(this.node.value, propName, value);
		}
	}

	/**
	 * 获取子级属性值
	 */
	getPropValue(propName: any): any {
		if (isProxy(this)) {
			return get(toRaw(this).node.value, propName);
		}
		return get(this.node.value, propName);
	}

	setNode(value: any) {
		this.node.value = value || {};
	}
}
