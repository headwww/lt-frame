<script lang="tsx">
import { PropType, defineComponent, reactive, watch } from 'vue';
import { isArray, isString } from 'lodash-es';
import { Tooltip } from 'ant-design-vue';
import { Recordable } from '@lt-frame/utils';
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
	emits: ['update:value'],
	setup(props) {
		const output = reactive<{
			[key: string]: any;
		}>(props.value);

		watch(
			() => output,
			() => {
				console.log('内部===》', output);
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

		/**
		 * setter配置对应的设置器
		 *
		 * @param key
		 * @param componentName
		 */
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
					if (isArray(value)) {
						output[key] = [];
						value.map((item) => {
							output[key].push(item);
						});
					} else {
						output[key] = value;
					}
				},
			};
			if (item.defaultValue) compAttr.value = item.defaultValue;
			if (item.initialValue) compAttr.value = item.initialValue;
			if (!isString(setter) && !isArray(setter)) {
				if (setter.defaultValue) compAttr.value = setter.defaultValue;
				if (setter.initialValue) compAttr.value = setter.initialValue;
			}
			if (output[key]) compAttr.value = output[key];

			return <Comp {...compAttr}></Comp>;
		}

		function createSettingFieldView(fieldConfig: FieldConfig) {
			const { display, title, name, setter, items } = fieldConfig;
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
									{items &&
										items.map((item) => (
											<div class={'m-8px flex'}>
												{item.title && createLabel(item.title)}
												{item.setter &&
													createComp(item.name, item.setter, item)}
											</div>
										))}
									{setter && (
										<div class={'m-8px'}>
											{createComp(name, setter, fieldConfig)}
										</div>
									)}
								</>
							),
						}}
					</LtCollapse>
				);
			}
			return (
				<div class={'m-8px flex'}>
					{title && createLabel(title)}
					{setter && createComp(name, setter, fieldConfig)}
				</div>
			);
		}

		return () => props.config?.map((item) => createSettingFieldView(item));
	},
});
</script>
