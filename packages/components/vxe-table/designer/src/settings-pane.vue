<script lang="tsx">
import {
	PropType,
	computed,
	defineComponent,
	reactive,
	toRaw,
	watch,
} from 'vue';
import { cloneDeep, isArray, isString, isUndefined } from 'lodash-es';
import { Tooltip } from 'ant-design-vue';
import { Recordable } from '@lt-frame/utils';
import { isFunction } from 'xe-utils';
import { FieldConfig, TitleConfig } from './types/field';
import { LtCollapse } from '../../../collapse';
import { componentMap } from './componentMap';
import { SetterConfig } from './types/setter';

export default defineComponent({
	name: 'Setter',
	props: {
		config: {
			type: Array as PropType<Array<FieldConfig>>,
		},
		value: {
			type: Object as PropType<any>,
		},
	},
	emits: ['update:value', 'change'],
	setup(props, { emit }) {
		const state = reactive<Recordable>(
			cloneDeep(props.value) ? cloneDeep(props.value) : {}
		);

		watch(
			() => state,
			() => {
				emit('update:value', toRaw(state));
			},
			{
				deep: true,
			}
		);

		function createLabel(title: string | TitleConfig) {
			if (isString(title)) {
				return (
					<div class={' w-70px'}>
						<span class={'font-size-12px'}>{title}</span>
					</div>
				);
			}
			return (
				<Tooltip title={title.tip}>
					{
						<div class={'font-size-12px w-70px'}>
							<span
								class={
									'underline underline-dashed underline-coolgray cursor-help '
								}
							>
								{title.label}
							</span>
						</div>
					}
				</Tooltip>
			);
		}

		function createComp(
			key: any,
			setter: string | SetterConfig | SetterConfig[],
			item: FieldConfig
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

			const compAttr: Recordable = {
				...compProps,
				onChange: (value: any) => {
					state[key] = value;
					emit('change', { key, value });
				},
			};

			if (!isUndefined(item.defaultValue)) {
				compAttr.value = item.defaultValue;
			}
			if (!isUndefined(item.initialValue)) {
				compAttr.value = item.initialValue;
			}
			if (!isString(setter) && !isArray(setter)) {
				if (!isUndefined(setter.defaultValue)) {
					compAttr.value = setter.defaultValue;
				}
				if (!isUndefined(setter.initialValue)) {
					compAttr.value = setter.initialValue;
				}
			}

			if (!isUndefined(state[key])) {
				compAttr.value = state[key];
			}

			return <Comp {...compAttr}></Comp>;
		}

		function createContent(item: FieldConfig, type: number) {
			const visible = computed(() => {
				const { condition } = item;
				if (condition) {
					return isFunction(condition) ? condition(state) !== false : true;
				}
				return true;
			});

			return (
				<div
					v-show={visible.value}
					class={{
						'm-8px': true,
						flex: type === 0,
					}}
				>
					{type === 0 && item.title && createLabel(item.title)}
					{item.setter && createComp(item.name, item.setter, item)}
				</div>
			);
		}

		function createSettingFieldView(fieldConfig: FieldConfig) {
			const { display, title, setter, items } = fieldConfig;
			if (display === 'accordion' || display === 'block') {
				return (
					<LtCollapse
						canExpand={display === 'accordion'}
						headerClass={'bg-gray-1'}
					>
						{{
							title: () => title && createLabel(title),
							default: () => (
								<>
									{items && items.map((item) => createContent(item, 0))}
									{setter && createContent(fieldConfig, 1)}
								</>
							),
						}}
					</LtCollapse>
				);
			}
		}

		return () => props.config?.map((item) => createSettingFieldView(item));
	},
});
</script>
