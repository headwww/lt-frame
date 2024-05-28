import { PropType, computed, defineComponent } from 'vue';
import { FieldConfig } from '../types/field';
import { createSettingFieldView } from '../settings-pane';

interface ObjectSetterConfig {
	items?: FieldConfig[];
}

export const ObjectSetter = defineComponent({
	name: 'ObjectSetter',
	inheritAttrs: false,
	props: {
		mode: {
			type: String as PropType<'popup' | 'form'>,
			default: 'form',
		},
		field: {
			type: Object as PropType<FieldConfig>,
			default: () => {},
		},
		config: Object as PropType<ObjectSetterConfig>,
	},
	setup(props) {
		return () => {
			const { mode } = props;
			if (mode === 'popup') {
				//
			} else {
				return <FormSetter {...props}></FormSetter>;
			}
		};
	},
});

export const FormSetter = defineComponent({
	name: 'FormSetter',
	props: {
		field: {
			type: Object as PropType<FieldConfig>,
			default: () => {},
		},
		config: Object as PropType<ObjectSetterConfig>,
	},
	setup(props) {
		console.log(props.field);

		const items = computed(() => {
			const { config } = props;
			if (config) {
				return config.items;
			}
			return [];
		});

		return () => (
			<div class="lt-setter-object lt-block-setter">
				{items.value?.map((item) => createSettingFieldView(item))}
			</div>
		);
	},
});
