import { CaretDownOutlined } from '@ant-design/icons-vue';
import { PropType, VNode, defineComponent, h, reactive } from 'vue';
import { TitleConfig } from './types/field';
import Title from './title';

/**
 * 创建一个属性设置器
 *
 * @param props 创建一个属性设置器需要的属性
 * @param children 具体的设置器
 * @returns
 */
export function createField(
	props: FieldProps,
	children: VNode | VNode[] | undefined
) {
	return h(
		Field,
		{ ...props },
		{
			default: () => children,
		}
	);
}

export interface FieldProps {
	defaultDisplay?: 'accordion' | 'inline' | 'block';
	collapsed?: boolean;
	title?: string | TitleConfig;
	onExpandChange?: (expandState: boolean) => void;
}

export const Field = defineComponent({
	name: 'LcField',
	props: {
		defaultDisplay: {
			type: String as PropType<'accordion' | 'inline' | 'block'>,
			default: 'inline',
		},
		collapsed: {
			type: Boolean,
			default: false,
		},
		title: [Object, String] as PropType<TitleConfig | string>,
		onExpandChange: Function as PropType<(expandState: boolean) => void>,
	},
	setup(props, { slots }) {
		const state = reactive({
			display: props.defaultDisplay || 'inline',
			collapsed: props.collapsed,
		});

		const toggleExpand = () => {
			const collapsed = !state.collapsed;
			state.collapsed = collapsed;
			props.onExpandChange && props.onExpandChange(!collapsed);
		};

		return () => {
			const { title } = props;
			const { display, collapsed } = state;
			const isAccordion = display === 'accordion';

			return (
				<div
					class={[
						'lt-field',
						`lt-${display}-field`,
						{
							'lt-field-is-collapsed': isAccordion && collapsed,
						},
					]}
				>
					<div
						class="lt-field-head"
						onClick={isAccordion ? toggleExpand : undefined}
					>
						<div class="lt-field-title">
							<Title title={title}></Title>
						</div>
						{isAccordion && <CaretDownOutlined class="lt-field-icon" />}
					</div>
					<div class="lt-field-body">
						{slots.default ? slots.default() : null}
					</div>
				</div>
			);
		};
	},
});
