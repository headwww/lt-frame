import {
	InjectionKey,
	PropType,
	Ref,
	computed,
	defineComponent,
	inject,
	onMounted,
	provide,
	ref,
	watch,
} from 'vue';
import { cloneDeep, isFunction, isUndefined, set } from 'lodash-es';
import { Recordable } from '@lt-frame/utils';
import { Input } from 'ant-design-vue';
import { FieldConfig } from './types/field';

export const SettingFieldView = defineComponent({
	name: 'SettingFieldView',
	props: {
		field: Object as PropType<FieldConfig>,
	},
	setup(props) {
		const { state, setValue } = inject(settingPaneKey) as SettingPaneMethods;

		const getVisible = computed(() => {
			const { field } = props;
			if (field) {
				const { condition } = field;
				return isFunction(condition) ? condition(state.value) !== false : true;
			}
			return true;
		});

		const value = ref();

		onMounted(() => {
			const { field } = props;
			let v;
			if (field) {
				const { defaultValue } = field;
				if (!isUndefined(defaultValue)) {
					v = defaultValue;
				}
			}

			if (state.value[props.field?.name!!]) {
				value.value = state.value[props.field?.name!!];
			} else {
				value.value = v;
			}
		});

		watch(
			() => value.value,
			() => {
				setValue(props.field?.name!!, value.value);
			}
		);

		return () => (
			<div>
				{getVisible.value && <Input v-model:value={value.value}></Input>}
			</div>
		);
	},
});

export const SettingGroupView = defineComponent({
	name: 'SettingGroupView',
	setup() {},
});

export const settingPaneKey: InjectionKey<SettingPaneMethods> =
	Symbol('settingPaneKey');

export interface SettingPaneMethods {
	readonly state: Ref<any>;
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

		watch(
			() => state.value,
			() => {},
			{
				deep: true,
			}
		);

		provide(settingPaneKey, {
			state,
			setValue,
		});

		function createSettingFieldView(field: FieldConfig) {
			if (field.type === 'group') {
				return <SettingGroupView></SettingGroupView>;
			}
			return <SettingFieldView field={field}></SettingFieldView>;
		}

		return () => {
			const { items } = props;
			return items?.map((item) => createSettingFieldView(item));
		};
	},
});
