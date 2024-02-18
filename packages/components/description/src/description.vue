<script lang="tsx">
import {
	CSSProperties,
	computed,
	defineComponent,
	ref,
	toRefs,
	unref,
} from 'vue';
import { useAttrs } from '@lt-frame/hooks';
import { Descriptions, DescriptionsProps, Tooltip } from 'ant-design-vue';
import { CopyOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { copyText, isFunction } from '@lt-frame/utils';
import { get } from 'lodash-es';
import {
	descriptionProps as props,
	DescriptionProps,
	DescItem,
	DescInstance,
} from './description';

export default defineComponent({
	name: 'LTDescription',
	props,
	emits: ['register'],
	setup(props, { slots, emit }) {
		const propsRef = ref<Partial<DescriptionProps> | null>(null);

		const attrs = useAttrs();

		const getMergeProps = computed(
			() =>
				({
					...props,
					...(unref(propsRef) as any),
				}) as DescriptionProps
		);

		const getProps = computed(() => {
			const opt = {
				...unref(getMergeProps),
			};
			return opt as DescriptionProps;
		});

		const getDescriptionsProps = computed(
			() => ({ ...unref(attrs), ...unref(getProps) }) as DescriptionsProps
		);

		function renderTip(isTip: boolean | undefined, tip: string | undefined) {
			if (!isTip) return null;

			return (
				<Tooltip title={tip}>
					<ExclamationCircleOutlined
						style={{ marginLeft: '6px', color: 'rgb(100, 106, 115)' }}
					/>
				</Tooltip>
			);
		}

		function renderLabel({
			label,
			labelMinWidth,
			labelStyle,
			isTip,
			tip,
		}: DescItem) {
			if (!labelStyle && !labelMinWidth) {
				return (
					<div>
						{label}
						{renderTip(isTip, tip)}
					</div>
				);
			}

			const labelStyles: CSSProperties = {
				...labelStyle,
				minWidth: `${labelMinWidth}px `,
			};
			return (
				<div style={labelStyles}>
					{label}
					{renderTip(isTip, tip)}
				</div>
			);
		}

		function renderCopyIcon(
			isCopyEnabled: boolean | undefined,
			getContent: () => string
		) {
			if (!isCopyEnabled) return null;

			return (
				<CopyOutlined
					style={{
						marginLeft: '6px',
						color: 'rgb(100, 106, 115)',
					}}
					onClick={() => copyText(getContent())}
				/>
			);
		}

		function renderItem() {
			const { schema, data } = unref(getProps);
			return unref(schema)
				.map((item) => {
					const {
						fieldStyle,
						render,
						field,
						show,
						span,
						contentMinWidth,
						isCopyEnabled,
					} = item;

					if (show && isFunction(show) && !show(data)) {
						return null;
					}

					const getContent = () => {
						const $_data = unref(getProps)?.data;
						if (!$_data) {
							return null;
						}
						const getField = get($_data, field);
						// eslint-disable-next-line
						if (getField && !toRefs($_data).hasOwnProperty(field)) {
							return isFunction(render) ? render('', $_data) : '';
						}
						return isFunction(render)
							? render(getField, $_data)
							: getField ?? '';
					};
					const width = contentMinWidth;
					return (
						<Descriptions.Item
							label={renderLabel(item)}
							key={field}
							span={span}
						>
							{() => {
								if (!contentMinWidth) {
									return (
										<div style={fieldStyle}>
											{getContent()}
											{renderCopyIcon(isCopyEnabled, getContent)}
										</div>
									);
								}
								const style: CSSProperties = {
									...fieldStyle,
									minWidth: `${width}px`,
								};
								return (
									<div style={style}>
										{getContent()}
										{renderCopyIcon(isCopyEnabled, getContent)}
									</div>
								);
							}}
						</Descriptions.Item>
					);
				})
				.filter((item) => !!item);
		}

		const renderDesc = () => (
			<Descriptions {...unref(getDescriptionsProps)}>
				{{
					default: () => renderItem(),
					extra: slots.extra,
				}}
			</Descriptions>
		);

		function setDescProps(descProps: Partial<DescriptionProps>): void {
			propsRef.value = {
				...(unref(propsRef) as Record<string, any>),
				...descProps,
			} as Record<string, any>;
		}

		const methods: DescInstance = {
			setDescProps,
		};

		emit('register', methods);
		return () => renderDesc();
	},
});
</script>
