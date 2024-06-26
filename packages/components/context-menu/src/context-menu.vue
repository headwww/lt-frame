<script lang="tsx">
import type { FunctionalComponent, CSSProperties, PropType } from 'vue';
import {
	defineComponent,
	nextTick,
	onMounted,
	computed,
	ref,
	unref,
	onUnmounted,
} from 'vue';
import { Menu, Divider } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import { LtIcon } from '../../icon';
import { ContextMenuItem, ItemContentProps, Axis } from './context-menu';

const ns = useNamespace('context-menu');

const props = {
	width: { type: Number, default: 156 },
	customEvent: { type: Object as PropType<Event>, default: null },
	styles: { type: Object as PropType<CSSProperties> },
	showIcon: { type: Boolean, default: true },
	axis: {
		// The position of the right mouse button click
		type: Object as PropType<Axis>,
		default() {
			return { x: 0, y: 0 };
		},
	},
	items: {
		// The most important list, if not, will not be displayed
		type: Array as PropType<ContextMenuItem[]>,
		default() {
			return [];
		},
	},
};

const ItemContent: FunctionalComponent<ItemContentProps> = (props) => {
	const { item } = props;
	return (
		<span
			style="display: inline-block; width: 100%; "
			class="lt-px"
			onClick={props.handler.bind(null, item)}
		>
			{props.showIcon && item.icon && <LtIcon class="lt-mr" icon={item.icon} />}
			<span>{item.label}</span>
		</span>
	);
};

export default defineComponent({
	name: 'ContextMenu',
	props,
	setup(props) {
		const wrapRef = ref(null);
		const showRef = ref(false);

		const getStyle = computed((): CSSProperties => {
			const { axis, items, styles, width } = props;
			const { x, y } = axis || { x: 0, y: 0 };
			const menuHeight = (items || []).length * 40;
			const menuWidth = width;
			const { body } = document;

			const left = body.clientWidth < x + menuWidth ? x - menuWidth : x;
			const top = body.clientHeight < y + menuHeight ? y - menuHeight : y;
			return {
				position: 'absolute',
				width: `${width}px`,
				left: `${left + 1}px`,
				top: `${top + 1}px`,
				zIndex: 9999,
				...styles, // Not the first, fix options.styles.width not working
			};
		});

		onMounted(() => {
			// eslint-disable-next-line no-return-assign
			nextTick(() => (showRef.value = true));
		});

		onUnmounted(() => {
			const el = unref(wrapRef);
			el && document.body.removeChild(el);
		});

		function handleAction(item: ContextMenuItem, e: MouseEvent) {
			const { handler, disabled } = item;
			if (disabled) {
				return;
			}
			showRef.value = false;
			e?.stopPropagation();
			e?.preventDefault();
			handler?.();
		}

		function renderMenuItem(items: ContextMenuItem[]) {
			const visibleItems = items.filter((item) => !item.hidden);
			return visibleItems.map((item) => {
				const { disabled, label, children, divider = false } = item;

				const contentProps = {
					item,
					handler: handleAction,
					showIcon: props.showIcon,
				};

				if (!children || children.length === 0) {
					return (
						<>
							<Menu.Item disabled={disabled} class={ns.e('item')} key={label}>
								<ItemContent {...contentProps} />
							</Menu.Item>
							{divider ? <Divider key={`d-${label}`} /> : null}
						</>
					);
				}
				if (!unref(showRef)) return null;

				return (
					<Menu.SubMenu
						key={label}
						disabled={disabled}
						popupClassName={ns.e('popup')}
					>
						{{
							title: () => <ItemContent {...contentProps} />,
							default: () => renderMenuItem(children),
						}}
					</Menu.SubMenu>
				);
			});
		}
		return () => {
			if (!unref(showRef)) {
				return null;
			}
			const { items } = props;
			return (
				<Menu
					inlineIndent={12}
					mode="vertical"
					class={ns.b()}
					ref={wrapRef}
					style={unref(getStyle)}
				>
					{renderMenuItem(items)}
				</Menu>
			);
		};
	},
});
</script>
