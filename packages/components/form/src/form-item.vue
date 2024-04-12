<script lang="tsx">
import {
	Ref,
	createCommentVNode,
	defineComponent,
	inject,
	onMounted,
	onUnmounted,
	provide,
	reactive,
	ref,
} from 'vue';
import { useNamespace } from '@lt-frame/hooks';
import {
	eqNull,
	isNaN,
	toValueString,
	get,
	isFunction,
	isNull,
	isUndefined,
} from 'xe-utils';
import { Tooltip } from 'ant-design-vue';
import { LtArrow, LtHelp } from '../../basic';
import { ItemInfo } from './itemInfo';
import { LtFormConstructor, FormPrivateMethods, SlotVNodeType } from './form';
import { LtRender } from './render';
import {
	getSlotVNs,
	isActivetem,
	LtFormItemProvide,
	createItem,
	watchItem,
	assemItem,
	destroyItem,
} from './util';
import { formItemProps } from './form-item';

export default defineComponent({
	name: 'LtFormItem',
	props: formItemProps,
	setup(props, { slots }) {
		const ns = useNamespace('form--item');
		const refElem = ref() as Ref<HTMLDivElement>;

		const formGather = inject(
			'$ltformgather',
			null as LtFormItemProvide | null
		);

		const $ltform = inject(
			'$ltform',
			{} as LtFormConstructor & FormPrivateMethods
		);
		const formItem = reactive(createItem($ltform, props));

		const ltformitem: LtFormItemProvide = { formItem };
		formItem.slots = slots;

		const ltformiteminfo = { itemConfig: formItem };
		provide('$ltformiteminfo', ltformiteminfo);
		provide('$ltformitem', ltformitem);
		provide('$ltformgather', null);

		watchItem(props, formItem);

		onMounted(() => {
			assemItem($ltform, refElem.value, formItem, formGather);
		});

		onUnmounted(() => {
			destroyItem($ltform, formItem);
		});
		const renderItem = (
			$ltform: LtFormConstructor & FormPrivateMethods,
			item: ItemInfo
		) => {
			const { props, formState } = $ltform;
			const { collapseAll } = formState;

			// 表单的属性
			const {
				data,
				rules,
				span: globalSpan,
				align: globalAlign,
				titleWidth: globalTitleWidth,
				titleAlign: globalTitleAlign,
				titleColon: globalTitleColon,
				vertical: globalVertical,
				titleAsterisk: globalTitleAsterisk,
				titleOverflow: globalTitleOverflow,
			} = props;
			// 表单项的属性
			const {
				visible,
				field,
				className,
				titleClassName,
				title,
				vertical,
				showTitle,
				slots,
				titleHelp,
				itemRender,
				folding,
				titleOverflow,
				contentClassName,
				contentStyle,
				collapseNode,
				titleStyle,
				showError,
				errRule,
			} = item;

			const params = { data, field, item, $form: $ltform };

			const compConf = itemRender
				? LtRender.renderer.get(itemRender.name)
				: null;

			const itemClassName = compConf ? compConf.itemClassName : '';
			const itemStyle = compConf ? compConf.itemStyle : null;
			const itemTitleClassName = compConf ? compConf.itemTitleClassName : '';
			const itemTitleStyle = compConf ? compConf.itemTitleStyle : null;
			const itemContentClassName = compConf
				? compConf.itemContentClassName
				: '';
			const itemContentStyle = compConf ? compConf.itemContentStyle : null;

			const span = item.span || globalSpan;
			const align = item.align || globalAlign;

			const titleSlot = slots ? slots.title : null;
			const titleAlign = eqNull(item.titleAlign)
				? globalTitleAlign
				: item.titleAlign;
			const titleColon = eqNull(item.titleColon)
				? globalTitleColon
				: item.titleColon;
			const titleAsterisk = eqNull(item.titleAsterisk)
				? globalTitleAsterisk
				: item.titleAsterisk;
			const titleWidth = eqNull(item.titleWidth)
				? globalTitleWidth
				: item.titleWidth;

			const itemOverflow =
				isUndefined(titleOverflow) || isNull(titleOverflow)
					? globalTitleOverflow
					: titleOverflow;
			const ovEllipsis = itemOverflow === 'ellipsis';
			const ovTitle = itemOverflow === 'title';
			const ovTooltip = itemOverflow === true || itemOverflow === 'tooltip';
			const hasEllipsis = ovTitle || ovTooltip || ovEllipsis;
			const itemVertical =
				isUndefined(vertical) || isNull(vertical) ? globalVertical : vertical;

			if (visible === false) {
				// 不显示 创建一个注释节点
				return createCommentVNode();
			}

			// 是否必填
			let isRequired = false;
			if (rules) {
				const itemRules = rules[field];
				if (itemRules) {
					isRequired = itemRules.some((rule) => rule.required);
				}
			}

			/** 渲染标签 */
			const renderTitle = () => {
				const titleSlot = slots ? slots.title : null;

				const titleComp =
					compConf && compConf.renderItemTitle
						? getSlotVNs(compConf.renderItemTitle(itemRender, params))
						: titleSlot
							? $ltform.callSlot(titleSlot, params)
							: title;
				return (
					<Tooltip title={ovTooltip && titleComp}>
						<div
							class={[
								ns.b('title'),
								titleAlign ? `align--${titleAlign}` : '',
								hasEllipsis ? 'is--ellipsis' : '',
								itemTitleClassName
									? isFunction(itemTitleClassName)
										? itemTitleClassName(params)
										: itemTitleClassName
									: '',
								titleClassName
									? isFunction(titleClassName)
										? titleClassName(params)
										: titleClassName
									: '',
							]}
							style={{
								...(isFunction(itemTitleStyle)
									? itemTitleStyle(params)
									: itemTitleStyle),
								...(isFunction(titleStyle) ? titleStyle(params) : titleStyle),
								...(titleWidth
									? {
											width: isNaN(titleWidth as number)
												? titleWidth
												: `${titleWidth}px`,
										}
									: null),
							}}
						>
							<div class={[ns.b('title-content')]}>
								<span class={[ns.b('title-label')]}>{titleComp}</span>
							</div>
							<div class={[ns.b('title-postfix')]}>
								{titleHelp ? <LtHelp {...titleHelp}></LtHelp> : []}
							</div>
						</div>
					</Tooltip>
				);
			};

			/** 渲染内容 */
			const renderContent = () => {
				const defaultSlot = slots ? slots.default : null;

				let contentVNs: SlotVNodeType[] = [];
				if (defaultSlot) {
					contentVNs = $ltform.callSlot(defaultSlot, params);
				} else if (compConf && compConf.renderItemContent) {
					contentVNs = getSlotVNs(
						compConf.renderItemContent(itemRender, params)
					);
				} else if (field) {
					contentVNs = [toValueString(get(data, field))];
				}

				if (collapseNode) {
					contentVNs.push(
						<div
							class={[ns.b('trigger-node')]}
							onClick={$ltform.toggleCollapseEvent}
						>
							<span class={[ns.b('trigger-text')]}>
								{collapseAll ? '展开' : '收起'}
							</span>
							<LtArrow
								class={[ns.b('trigger-icon')]}
								up={!collapseAll}
								down={collapseAll}
							></LtArrow>
						</div>
					);
				}

				const { computeValidOpts } = $ltform.getComputeMaps();
				const validOpts = computeValidOpts.value;
				if (errRule && validOpts.showMessage) {
					const width = errRule.maxWidth
						? {
								width: `${errRule.maxWidth}px`,
							}
						: null;
					contentVNs.push(
						<div class={[ns.b('valid')]} style={width}>
							{errRule.content}
						</div>
					);
				}

				return (
					<div
						class={[
							ns.b('content'),
							align ? `align--${align}` : '',
							itemContentClassName
								? isFunction(itemContentClassName)
									? itemContentClassName(params)
									: itemContentClassName
								: '',
							contentClassName
								? isFunction(contentClassName)
									? contentClassName(params)
									: contentClassName
								: '',
						]}
						style={{
							...(isFunction(itemContentStyle)
								? itemContentStyle(params)
								: itemContentStyle),
							...(isFunction(contentStyle)
								? contentStyle(params)
								: contentStyle),
						}}
					>
						{contentVNs}
					</div>
				);
			};
			return (
				<div
					ref={refElem}
					class={[
						ns.b(),
						item.id,
						span ? `lt-col--${span}` : '',
						className
							? isFunction(className)
								? className(params)
								: className
							: '',
						itemClassName
							? isFunction(itemClassName)
								? itemClassName(params)
								: itemClassName
							: '',
						{
							[ns.is('-title')]: title,
							[ns.is('-colon')]: titleColon,
							[ns.is('-vertical')]: itemVertical,
							[ns.is('-asterisk')]: titleAsterisk,
							[ns.is('-required')]: isRequired,
							[ns.is('-hidden')]: folding && collapseAll,
							[ns.is('-active')]: isActivetem($ltform, item),
							[ns.is('-error')]: showError,
						},
					]}
					style={isFunction(itemStyle) ? itemStyle(params) : itemStyle}
				>
					<div class={[ns.b('inner')]}>
						{showTitle !== false && (title || titleSlot) ? renderTitle() : null}
						{renderContent()}
					</div>
				</div>
			);
		};

		const renderVN = () => {
			const formProps = $ltform ? $ltform.props : null;
			return formProps && formProps.customLayout ? (
				renderItem($ltform, formItem as unknown as ItemInfo)
			) : (
				<div ref={refElem}></div>
			);
		};
		return () => renderVN();
	},
});
</script>
