import XEUtils from 'xe-utils';
import { watch } from 'vue';
import { LtFormConstructor } from './form';
import { ItemInfo, SlotVNodeType } from './itemInfo';
import { LtRender } from './render';

export interface LtFormItemProvide {
	formItem: ItemInfo;
}

export function isFormItem(item: any): item is ItemInfo {
	return item instanceof ItemInfo;
}

export function createItem($ltform: LtFormConstructor, _vm: any) {
	return isFormItem(_vm) ? _vm : new ItemInfo($ltform, _vm);
}

export function getSlotVNs(vns: SlotVNodeType | SlotVNodeType[]) {
	if (XEUtils.isArray(vns)) {
		return vns;
	}
	return [vns];
}

export function isActivetem($ltform: LtFormConstructor, itemInfo: ItemInfo) {
	const { itemRender, visible, field } = itemInfo;
	let { visibleMethod } = itemInfo;
	if (visible === false) {
		return visible;
	}
	const compConf = itemRender ? LtRender.renderer.get(itemRender.name) : null;
	if (!visibleMethod && compConf && compConf.itemVisibleMethod) {
		visibleMethod = compConf.itemVisibleMethod;
	}
	if (!visibleMethod) {
		return true;
	}
	const { data } = $ltform.props;
	return visibleMethod({ data, field, item: itemInfo, $form: $ltform });
}

export function handleFieldOrItem(
	$ltform: LtFormConstructor,
	fieldOrItem: string | ItemInfo
) {
	if (fieldOrItem) {
		return XEUtils.isString(fieldOrItem)
			? $ltform.getItemByField(fieldOrItem)
			: fieldOrItem;
	}
	return null;
}

export function isEnableConf(conf: any): boolean {
	return conf && conf.enabled !== false;
}

export function getResetValue(value: any, resetValue: any) {
	if (XEUtils.isArray(value)) {
		resetValue = [];
	}
	return resetValue;
}

export function assemItem(
	$xeform: LtFormConstructor,
	el: HTMLDivElement,
	formItem: ItemInfo,
	formGather: LtFormItemProvide | null
) {
	const { formState } = $xeform;
	const { staticItems } = formState;
	const parentElem = el.parentNode;
	const parentItem = formGather ? formGather.formItem : null;
	const parentItems = parentItem ? parentItem.children : staticItems;
	if (parentElem) {
		parentItems.splice(
			XEUtils.arrayIndexOf(parentElem.children, el),
			0,
			formItem
		);
		formState.staticItems = staticItems.slice(0);
	}
}

export function destroyItem($xeform: LtFormConstructor, formItem: ItemInfo) {
	const { formState } = $xeform;
	const { staticItems } = formState;
	const index = XEUtils.findIndexOf(
		staticItems,
		(item) => item.id === formItem.id
	);
	if (index > -1) {
		staticItems.splice(index, 1);
	}
	formState.staticItems = staticItems.slice(0);
}

export function watchItem(props: any, formItem: ItemInfo) {
	Object.keys(props).forEach((name) => {
		watch(
			() => props[name],
			(value: any) => {
				formItem.update(name, value);
			}
		);
	});
}
