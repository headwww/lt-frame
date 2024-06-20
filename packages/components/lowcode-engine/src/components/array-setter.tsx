import {
	PropType,
	defineComponent,
	h,
	nextTick,
	reactive,
	ref,
	unref,
	watch,
} from 'vue';
import { Alert, Button } from 'ant-design-vue';
import { DeleteOutlined, HolderOutlined } from '@ant-design/icons-vue';
import { useScrollTo } from '@lt-frame/hooks';
import { ISettingField } from '../types/setting-field';
import {
	IPublicTypeSetterConfig,
	IPublicTypeSetterType,
} from '../types/setter-config';
import { IPublicTypeFieldConfig } from '../types/field-config';
import Title from '../title';
import { createSettingFieldView } from '../settings-pane';
import { LtDraggable } from '../../../draggable';

export const ArraySetter = defineComponent({
	name: 'ArraySetter',
	props: {
		value: Array as PropType<Array<any>>,
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		itemSetter: [Object, Array, String] as PropType<IPublicTypeSetterType>,
	},
	setup(props) {
		const { itemSetter } = props;
		let columns: IPublicTypeFieldConfig[] | undefined;
		if (
			(itemSetter as IPublicTypeSetterConfig)?.componentName === 'ObjectSetter'
		) {
			const items: IPublicTypeFieldConfig[] = (itemSetter as any).props?.config
				?.items;
			if (items && Array.isArray(items)) {
				columns = items.filter(
					(item) => item.isRequired || (item.setter as any)?.isRequired
				);
				if (columns.length > 4) {
					columns = columns.slice(0, 4);
				}
			}
		}

		return () => (
			<ListSetter {...props} columns={columns?.slice(0.4)}></ListSetter>
		);
	},
});

interface ArraySetterState {
	items: ISettingField[];
}

export const ListSetter = defineComponent({
	name: 'ListSetter',
	props: {
		value: Array as PropType<Array<any>>,
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		itemSetter: [Object, Array, String] as PropType<IPublicTypeSetterType>,
		columns: Array as PropType<IPublicTypeFieldConfig[]>,
		onChange: Function,
	},
	setup(props) {
		const state = reactive<ArraySetterState>({
			items: [],
		});

		const draggable = ref();

		watch(
			() => props.value,
			() => {
				updateItems();
			},
			{
				deep: true,
			}
		);

		watch(
			() => state.items,
			() => {
				const value: any[] = [];
				state.items.forEach((item, index) => {
					value.push(item.getValue());
					item.setName(`[${index}]`);
				});
				props.onChange?.(value);
			}
		);

		const updateItems = () => {
			const { value, field, itemSetter } = props;
			const valueLength = value && Array.isArray(value) ? value.length : 0;
			for (let i = 0; i < valueLength; i++) {
				let item = state.items[i];
				if (!item) {
					item = field.createField({
						name: `[${i}]`,
						setter: itemSetter,
						forceInline: 1,
						type: 'field',
						extraProps: {
							defaultValue: value!![i],
						},
					});
					if (value) {
						item.setValue(value[i]);
					}
					state.items.push(item);
				}
			}
		};
		updateItems();

		const onAdd = (newValue?: { [key: string]: any }) => {
			const { itemSetter, field, onChange, value = [] } = props;
			const values = value || [];
			const initialValue = (itemSetter as any)?.initialValue;
			const defaultValue =
				newValue ||
				(typeof initialValue === 'function'
					? initialValue(field)
					: initialValue);
			values.push(defaultValue);
			onChange?.(values);

			nextTick(() => {
				const wrap = unref(draggable);
				if (!wrap) {
					return;
				}
				const scrollHeight = wrap.scrollHeight as number;

				const { start } = useScrollTo({
					el: wrap,
					to: scrollHeight,
				});
				start();
			});
		};

		const onRemove = (field: ISettingField) => {
			const i = state.items.indexOf(field);
			state.items.splice(i, 1);
			state.items = [...state.items];
		};

		return () => {
			let columns: any = null;

			if (props.columns) {
				columns = props.columns.map((column) => (
					<Title
						key={column.name}
						title={column.title || (column.name as string)}
					/>
				));
			}
			state.items.map((item, index) => state.items.splice(index, 1, item));

			const content =
				state.items.length > 0 ? (
					<div ref={draggable} class="lt-array-draggable">
						<LtDraggable
							dragClass={'lt-array-draggable__bg'}
							ghostClass={'lt-array-draggable__bg'}
							animation={150}
							v-model={state.items}
						>
							{state.items.map((field) => (
								<ArrayItem
									onRemove={onRemove}
									key={field.id}
									field={field}
								></ArrayItem>
							))}
						</LtDraggable>
					</div>
				) : (
					<Alert
						message={'暂时还没有添加内容'}
						type="info"
						style={{
							margin: ' 8px',
						}}
						showIcon
					></Alert>
				);

			return (
				<div class="lt-setter-list lt-block-setter">
					{columns && state.items.length > 0 ? (
						<div class="lt-setter-list-columns">{columns}</div>
					) : null}
					{content}
					<div class={'lt-array-add'}>
						<Button onClick={() => onAdd()} type={'link'}>
							添加一项 +
						</Button>
					</div>
				</div>
			);
		};
	},
});

export const ArrayItem = defineComponent({
	name: 'ArrayItem',
	props: {
		field: {
			type: Object as PropType<ISettingField>,
			default: () => {},
		},
		onRemove: Function,
	},
	setup(props) {
		return () => {
			const { field, onRemove } = props;

			return (
				<div class="lt-listitem">
					<div class="lt-listitem-body">{createSettingFieldView(field)}</div>
					<div class="lt-listitem-actions">
						<Button
							size="small"
							type="text"
							onClick={() => {
								onRemove && onRemove(field);
							}}
							icon={h(DeleteOutlined)}
						/>
						<Button
							draggable
							size="small"
							type="text"
							style={{ cursor: 'move' }}
							class="handle"
							icon={h(HolderOutlined)}
						/>
					</div>
				</div>
			);
		};
	},
});
