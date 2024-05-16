<script lang="tsx">
import { PropType, computed, defineComponent, h, ref, watch } from 'vue';
import { Alert, Button, Popover } from 'ant-design-vue';
import {
	DeleteOutlined,
	EditOutlined,
	HolderOutlined,
} from '@ant-design/icons-vue';
import { isArray, isString } from 'lodash-es';
import { SetterConfig } from '../types/setter';
import { LtDraggable } from '../../../../draggable';
import { componentMap } from '../componentMap';

export default defineComponent({
	name: 'ArraySetter',
	props: {
		value: {
			type: Array as PropType<any[]>,
			default: () => [],
		},
		itemSetter: Object as PropType<SetterConfig>,
	},
	emits: ['change'],
	setup(props, { emit }) {
		const list = ref<any[]>(props.value);

		function handleAdd() {
			list.value.push({});
		}

		function handleRemove(index: number) {
			list.value.splice(index, 1);
		}

		watch(
			() => list.value,
			() => {
				emit('change', list.value);
			},
			{
				deep: true,
			}
		);

		const getIsRequired = computed(() => {
			const { itemSetter } = props;
			if (itemSetter?.componentName === 'ObjectSetter') {
				const { props } = itemSetter;
				if (props && props.config && isArray(props.config)) {
					return props.config.filter((item) => item.isRequired);
				}
			}
			return [];
		});

		function createCompObjectSetter(
			item: any,
			setter: string | SetterConfig | SetterConfig[],
			index: number
		) {
			let componentName: string = '';
			let compProps = {};
			if (isString(setter)) {
				componentName = setter;
			} else if (!isArray(setter)) {
				componentName = setter.componentName;
				if (setter.props) {
					compProps = setter.props;
				}
			}

			const Comp = componentMap.get(componentName) as ReturnType<
				typeof defineComponent
			>;

			const compAttr = {
				...compProps,
				onChange: (value: any) => {
					list.value[index] = value;
				},
				value: item,
			};

			return <Comp {...compAttr}></Comp>;
		}

		function createIsRequired(
			key: any,
			setter: string | SetterConfig | SetterConfig[],
			index: number
		) {
			let componentName: string = '';
			let compProps = {};
			if (isString(setter)) {
				componentName = setter;
			} else if (!isArray(setter)) {
				componentName = setter.componentName;
				if (setter.props) {
					compProps = setter.props;
				}
			}

			const Comp1 = componentMap.get(componentName) as ReturnType<
				typeof defineComponent
			>;

			const compAttr = {
				...compProps,
				onChange: (value: any) => {
					list.value[index][key] = value;
				},
				value: list.value[index][key],
			};

			return <Comp1 {...compAttr}></Comp1>;
		}

		function createItem(item: any, index: number) {
			const { itemSetter } = props;

			return (
				<div class={['flex', 'flex-items-center', 'mt-3px']}>
					<Popover
						overlayStyle={{
							height: '100%',
						}}
						overlayInnerStyle={{
							height: '100%',
						}}
						trigger={'click'}
						placement={'left'}
						overlayClassName={'lt-cus-popover'}
					>
						{{
							default: () => (
								<Button type={'text'} icon={h(EditOutlined)}></Button>
							),
							content: () => (
								<div class="w-310px h-full">
									{itemSetter &&
										createCompObjectSetter(item, itemSetter, index)}
								</div>
							),
						}}
					</Popover>
					<div class="flex w-80%">
						{getIsRequired.value.map(
							(item) =>
								item.setter && createIsRequired(item.name, item.setter, index)
						)}
					</div>
					<Button
						onClick={() => handleRemove(index)}
						size="small"
						type="text"
						icon={h(DeleteOutlined)}
					/>
					<Button
						size="small"
						type="text"
						class="handle cursor-move"
						icon={h(HolderOutlined)}
					/>
				</div>
			);
		}

		return () => (
			<div>
				{list.value && list.value.length === 0 && (
					<Alert
						message={'暂时还没有添加内容'}
						type="info"
						class={'m-8px'}
						showIcon
					></Alert>
				)}
				<LtDraggable
					dragClass={'lt-table-desinger-dg-class'}
					ghostClass={'lt-table-desinger-dg-class'}
					animation={150}
					handle={'.handle'}
					modelValue={list.value}
					class={['flex', 'flex-col', 'max-h-230px', 'overflow-auto']}
				>
					{list.value.map((item, index) => createItem(item, index))}
				</LtDraggable>
				<Button onClick={handleAdd} type={'link'}>
					添加一项 +
				</Button>
			</div>
		);
	},
});
</script>
