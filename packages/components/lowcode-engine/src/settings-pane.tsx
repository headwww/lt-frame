import {
	InjectionKey,
	PropType,
	Ref,
	computed,
	createCommentVNode,
	defineComponent,
	onMounted,
	provide,
	ref,
	watch,
} from 'vue';
import { Recordable } from '@lt-frame/utils';
import { createField } from './fields';
import { LtSetterRender } from './render';
import { SettingTopEntry } from './types/setting-top-entry';
import { ISettingField } from './types/setting-field';
import { IPublicTypeFieldConfig } from './types/field-config';
import { isSetterConfig } from './types/setter-config';
import { settingsPaneContext } from './context-key';

export const SettingFieldView = defineComponent({
	name: 'SettingFieldView',
	props: {
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
	},
	setup(props) {
		const { field } = props;
		const { extraProps } = field;
		const setterInfo = computed(
			(): {
				setterProps: any;
				initialValue: any;
				setterType: any;
			} => {
				const { extraProps, setter } = field;
				const { defaultValue } = extraProps;
				let setterProps: Recordable = {};
				let setterType: any;
				let initialValue: any;

				if (Array.isArray(setter)) {
					//
				} else if (isSetterConfig(setter)) {
					setterType = setter.componentName;
					if (setter.props) {
						setterProps = setter.props;
					}
					if (setter.initialValue != null) {
						initialValue = setter.initialValue;
					}
				} else if (setter) {
					setterType = setter;
				}

				if (defaultValue != null && !('defaultValue' in setterProps)) {
					setterProps.defaultValue = defaultValue;
					if (initialValue == null) {
						initialValue = defaultValue;
					}
				}

				return {
					setterProps,
					setterType,
					initialValue,
				};
			}
		);

		const visible = computed(() => {
			const { condition } = extraProps;
			try {
				return typeof condition === 'function'
					? condition(field) !== false
					: true;
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('exception when condition (hidden) is excuted', error);
			}

			return true;
		});

		onMounted(() => {
			const { initialValue } = setterInfo.value;
			if (
				!(initialValue !== undefined && initialValue !== null) ||
				field.getValue() !== undefined
			) {
				return;
			}

			field.setValue(initialValue);
		});

		return () => {
			const { setterType, initialValue, setterProps } = setterInfo.value;
			const comp = setterType ? LtSetterRender.renderer.get(setterType) : null;

			if (!visible.value) {
				return null;
			}

			return comp
				? createField(
						{
							title: field.title,
						},
						comp.createSetterContent
							? comp.createSetterContent({
									...setterProps,
									forceInline: extraProps.forceInline,
									key: field.id,
									props: field,
									field,
									initialValue,
									value: field.getValue(),
									onChange: (value: any) => {
										field.setValue(value);
									},
								})
							: undefined,
						extraProps.forceInline ? 'plain' : extraProps.display
					)
				: createCommentVNode(
						setterType
							? `"${setterType}" not found`
							: 'Please set the setter property'
					);
		};
	},
});

export const SettingGroupView = defineComponent({
	name: 'SettingGroupView',
	props: {
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
	},
	setup(props) {
		return () => {
			const { field } = props;
			const { extraProps } = field;
			const { condition, display } = extraProps;
			const visible =
				typeof condition === 'function' ? condition(field) !== false : true;
			if (!visible) {
				return null;
			}
			return createField(
				{
					title: field.title,
				},
				field.items.map((item) => createSettingFieldView(item)),
				display
			);
		};
	},
});

export function createSettingFieldView(field: ISettingField) {
	if (field.isGroup) {
		return <SettingGroupView key={field.id} field={field}></SettingGroupView>;
	}
	return <SettingFieldView key={field.id} field={field}></SettingFieldView>;
}

export const settingPaneKey: InjectionKey<SettingPaneMethods> =
	Symbol('settingPaneKey');

export interface SettingPaneMethods {
	readonly state: Ref<Recordable>;
	setValue: (attrName: string | number, attrValue: any) => void;
}

export const SettingsPane = defineComponent({
	name: 'SettingPane',
	props: {
		items: {
			type: Array as PropType<Array<IPublicTypeFieldConfig>>,
			default: () => [],
		},
		state: Object as PropType<Recordable>,

		value: {
			type: Object as PropType<Recordable>,
		},
	},
	emits: ['update:value'],
	setup(props, { emit }) {
		const popoverLock = ref(true);

		provide(settingsPaneContext, {
			popoverLock,
		});

		const settingTopEntry = new SettingTopEntry(props.items, props.value || {});

		watch(
			() => settingTopEntry.node.value,
			() => {
				emit('update:value', settingTopEntry.node.value);
			},
			{
				deep: true,
			}
		);

		return () => {
			const { items } = settingTopEntry;
			return items?.map((item) => createSettingFieldView(item));
		};
	},
});
