import { CaretDownOutlined } from '@ant-design/icons-vue';
import { PropType, VNode, defineComponent, h, reactive } from 'vue';
import Title from './title';
import { IPublicTypeTitleContent } from './types/title-config';

/**
 * 创建一个属性设置器
 *
 * @param props 创建一个属性设置器需要的属性
 * @param children 具体的设置器
 * @returns
 */
export function createField(
	props: FieldProps,
	children: VNode | VNode[] | undefined,
	type?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry'
) {
	return h(
		Field,
		{ ...props, defaultDisplay: type },
		{
			default: () => children,
		}
	);
}

export interface FieldProps {
	title?: string | IPublicTypeTitleContent;
	defaultDisplay?:
		| 'accordion'
		| 'inline'
		| 'block'
		| 'plain'
		| 'popup'
		| 'entry';
	collapsed?: boolean;
	onExpandChange?: (expandState: boolean) => void;
	[extra: string]: any;
}

export const Field = defineComponent({
	name: 'Field',
	props: {
		defaultDisplay: {
			type: String as PropType<
				'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry'
			>,
			default: 'inline',
		},
		title: [Object, String] as PropType<string | IPublicTypeTitleContent>,
		collapsed: {
			type: Boolean,
			default: false,
		},
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
					{display !== 'plain' && (
						<div
							class="lt-field-head"
							onClick={isAccordion ? toggleExpand : undefined}
						>
							<div class="lt-field-title">
								<Title title={title}></Title>
							</div>
							{isAccordion && <CaretDownOutlined class="lt-field-icon" />}
						</div>
					)}
					<div class="lt-field-body">
						{slots.default ? slots.default() : null}
					</div>
				</div>
			);
		};
	},
});
