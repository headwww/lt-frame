import { PropType, defineComponent, h, inject, reactive, ref } from 'vue';
import { Button, Popover } from 'ant-design-vue';
import { EditOutlined } from '@ant-design/icons-vue';
import { createSettingFieldView } from '../settings-pane';
import { ISettingField } from '../types/setting-field';
import { IPublicTypeFieldConfig } from '../types/field-config';
import { SettingsPaneContext, settingsPaneContext } from '../context-key';

interface ObjectSetterConfig {
	items?: IPublicTypeFieldConfig[];
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
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		config: Object as PropType<ObjectSetterConfig>,
		forceInline: Number,
	},
	setup(props) {
		return () => {
			const { mode, forceInline } = props;

			if (forceInline) {
				if (forceInline > 2 || mode === 'popup') {
					//
				} else {
					return <RowSetter columns={forceInline > 1 ? 2 : 4} {...props} />;
				}
			} else {
				return <FormSetter {...props}></FormSetter>;
			}
		};
	},
});

export const RowSetter = defineComponent({
	name: 'RowSetter',
	props: {
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		config: Object as PropType<ObjectSetterConfig>,
		columns: Number,
	},
	setup(props) {
		const state = reactive<{
			items: ISettingField[];
		}>({
			items: [],
		});

		const popoverOpen = ref(false);
		const { popoverLock } = inject(settingsPaneContext) as SettingsPaneContext;

		function getItemsFromProps() {
			const { field, config, columns } = props;
			// const { extraProps } = field;
			const items: ISettingField[] = [];

			if (columns && config?.items) {
				const l = Math.min(config.items.length, columns);
				for (let i = 0; i < config.items.length; i++) {
					const conf = config.items[i];
					if (conf.isRequired || (conf.setter as any)?.isRequired) {
						const item =
							state?.items?.filter((d) => d.name === conf.name)?.[0] ||
							field.createField({
								...conf,
								// in column-cell
								forceInline: 3,
							});
						items.push(item);
					}
					if (items.length >= l) {
						break;
					}
				}
			}
			return items;
		}

		state.items = [...getItemsFromProps()];

		return () => {
			const { items } = state;
			const { field, config } = props;
			return (
				<div class="lt-setter-object-row">
					<Popover
						overlayStyle={{
							height: '100%',
						}}
						overlayInnerStyle={{
							height: '100%',
						}}
						destroyTooltipOnHide
						trigger="click"
						placement="left"
						open={popoverOpen.value}
						onOpenChange={(open: any) => {
							if (popoverLock.value) {
								popoverOpen.value = open;
							}
						}}
						overlayClassName="lt-cus-popover"
					>
						{{
							default: () => (
								<Button
									class="lt-setter-object-row-edit"
									type={'text'}
									icon={h(EditOutlined)}
								></Button>
							),
							content: () => (
								<div class="w-310px h-full">
									<FormSetter
										key={field.id}
										field={field}
										config={config}
									></FormSetter>
								</div>
							),
						}}
					</Popover>

					<div class="lt-setter-object-row-body">
						{items.map((item) => createSettingFieldView(item))}
					</div>
				</div>
			);
		};
	},
});

export const FormSetter = defineComponent({
	name: 'FormSetter',
	props: {
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		config: Object as PropType<ObjectSetterConfig>,
	},
	setup(props) {
		const { config, field } = props;

		const items = (config?.items || []).map((conf) =>
			field.createField({
				...conf,
			})
		);
		return () => (
			<div class="lt-setter-object lt-block-setter">
				{items?.map((item) => createSettingFieldView(item))}
			</div>
		);
	},
});
