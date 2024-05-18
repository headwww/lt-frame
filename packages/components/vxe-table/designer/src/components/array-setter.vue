<script lang="tsx">
import {
	PropType,
	computed,
	defineComponent,
	h,
	nextTick,
	ref,
	unref,
	watch,
} from 'vue';
import { Alert, Button, Popover } from 'ant-design-vue';
import {
	DeleteOutlined,
	EditOutlined,
	HolderOutlined,
} from '@ant-design/icons-vue';
import { isArray, isString, omit, uniqueId } from 'lodash-es';
import { useScrollTo } from '@lt-frame/hooks';
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
		const draggable = ref();

		const list = ref<any[]>(
			props.value.map((item) => ({ ...item, $lt_id: uniqueId('LT_') }))
		);

		function handleAdd() {
			list.value.push({
				...props.itemSetter?.initialValue,
				$lt_id: uniqueId('LT_'),
			});
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
		}

		function handleRemove(index: number) {
			list.value.splice(index, 1);
		}

		watch(
			() => list.value,
			() => {
				emit(
					'change',
					list.value.map((item) => ({ ...omit(item, '$lt_id') }))
				);
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
					list.value.splice(index, 1, value);
				},
				value: list.value[index],
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

			const Comp = componentMap.get(componentName) as ReturnType<
				typeof defineComponent
			>;

			const compAttr = {
				...compProps,
				onChange: (value: any) => {
					const v = {
						...list.value[index],
						[key]: value,
					};
					list.value.splice(index, 1, v);
				},
				value: list.value[index][key],
			};

			return <Comp {...compAttr}></Comp>;
		}

		function createItem(item: any, index: number) {
			const { itemSetter } = props;
			return (
				<div key={item.$lt_id} class={['flex', 'flex-items-center', 'mt-3px']}>
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
						overlayClassName="lt-cus-popover"
					>
						{{
							default: () => (
								<Button type={'text'} icon={h(EditOutlined)}></Button>
							),
							content: () => (
								<div class="w-310px h-full">
									{itemSetter && createCompObjectSetter(itemSetter, index)}
								</div>
							),
						}}
					</Popover>
					<div class="flex w-80%">
						{getIsRequired.value.map(
							(item) =>
								item.setter && (
									<div class="mr-5px">
										{createIsRequired(item.name, item.setter, index)}
									</div>
								)
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
				<div ref={draggable} class={['max-h-230px', 'overflow-auto']}>
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
						v-model={list.value}
						class={['flex', 'flex-col']}
					>
						{list.value.map((item, index) => createItem(item, index))}
					</LtDraggable>
				</div>

				<Button onClick={handleAdd} type={'link'}>
					添加一项 +
				</Button>
			</div>
		);
	},
});
</script>
