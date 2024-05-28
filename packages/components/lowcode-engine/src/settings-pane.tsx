import {
	InjectionKey,
	PropType,
	Ref,
	computed,
	createCommentVNode,
	defineComponent,
	inject,
	onMounted,
	provide,
	ref,
	watch,
} from 'vue';
import {
	cloneDeep,
	isArray,
	isFunction,
	isNull,
	isObject,
	isUndefined,
	set,
} from 'lodash-es';
import { Recordable } from '@lt-frame/utils';
import { FieldConfig } from './types/field';
import { createField } from './fields';
import { LtSetterRender } from './render';

export const SettingFieldView = defineComponent({
	name: 'SettingFieldView',
	props: {
		field: {
			type: Object as PropType<FieldConfig>,
			default: () => {},
		},
	},
	setup(props) {
		const { state, setValue } = inject(settingPaneKey) as SettingPaneMethods;

		const setterInfo = computed(() => {
			const { setter, defaultValue } = props.field;

			let setterProps: Recordable = {};
			let setterType;
			let initialValue = null;
			if (isArray(setter)) {
				// 混合设置器
			} else if (isObject(setter)) {
				setterType = setter.componentName;
				if (setter.props) {
					setterProps = setter.props;
				}
				if (setter.initialValue != null) {
					initialValue = setter.initialValue;
				}
			} else {
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
		});

		const getVisible = computed(() => {
			const { field } = props;
			if (field) {
				const { condition } = field;
				return isFunction(condition) ? condition(state.value) !== false : true;
			}
			return true;
		});

		const getValue = computed(() => {
			const { name } = props.field;
			return name ? state.value[name] : undefined;
		});

		function initDefaultValue() {
			const { initialValue } = setterInfo.value;

			if (
				!(!isUndefined(initialValue) && !isNull(initialValue)) ||
				getValue.value !== undefined
			) {
				return;
			}

			setValue(props.field.name!!, initialValue);
		}

		onMounted(() => {
			initDefaultValue();
		});
		return () => {
			if (!getVisible.value) {
				return null;
			}

			const { field } = props;
			const { setterType, setterProps, initialValue } = setterInfo.value;
			const comp = setterType ? LtSetterRender.renderer.get(setterType) : null;

			return comp
				? createField(
						{
							defaultDisplay: field.display,
							title: field.title,
						},
						comp.createSetterContent
							? comp.createSetterContent({
									...setterProps,
									field,
									value: getValue.value,
									initialValue,
									onChange: (value: any) => {
										if (field.name) {
											setValue(field.name, value);
										}
									},
								})
							: undefined
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
			type: Object as PropType<FieldConfig>,
			default: () => {},
		},
	},
	setup(props) {
		const { state } = inject(settingPaneKey) as SettingPaneMethods;

		const getVisible = computed(() => {
			const { field } = props;
			if (field) {
				const { condition } = field;
				return isFunction(condition) ? condition(state.value) !== false : true;
			}
			return true;
		});

		return () => {
			const { field } = props;
			if (!getVisible.value) {
				return null;
			}
			return createField(
				{
					defaultDisplay: field.display,
					title: field.title,
				},
				props.field.items?.map((item) => createSettingFieldView(item))
			);
		};
	},
});

export function createSettingFieldView(field: FieldConfig) {
	if (field.type === 'group') {
		return <SettingGroupView field={field}></SettingGroupView>;
	}
	return <SettingFieldView field={field}></SettingFieldView>;
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
		items: Object as PropType<Array<FieldConfig>>,
		state: Object as PropType<Recordable>,
	},
	setup(props) {
		const state = ref<Recordable>(props.state ? cloneDeep(props.state) : {});

		const setValue = (attrName: string | number, attrValue: any) => {
			set(state.value, attrName, attrValue);
		};

		provide(settingPaneKey, {
			state,
			setValue,
		});

		watch(
			() => state.value,
			() => {
				console.log(state.value);
			},
			{
				deep: true,
			}
		);

		return () => {
			const { items } = props;
			return items?.map((item) => createSettingFieldView(item));
		};
	},
});
