<script lang="tsx">
import {
	PropType,
	createCommentVNode,
	defineComponent,
	inject,
	provide,
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
import { ItemInfo, SlotVNodeType } from './itemInfo';
import { LtFormConstructor, FormPrivateMethods } from './form';
import { LtRender } from './render';
import { getSlotVNs, isActivetem } from './util';
import FormConfigItem from './form-config-item.vue';

export default defineComponent({
	name: 'LtFormConfigItem',
	props: {
		itemConfig: Object as PropType<ItemInfo>,
	},
	setup(props) {
		const ns = useNamespace('form--item');
		const $ltform = inject(
			'$ltform',
			{} as LtFormConstructor & FormPrivateMethods
		);
		const ltformiteminfo = { itemConfig: props.itemConfig };
		provide('$ltformiteminfo', ltformiteminfo);
		provide('$ltformgather', null);

		return () => {
			const { formState } = $ltform;
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
			} = $ltform.props;
			// 表单项的属性
			const item = props.itemConfig as ItemInfo;
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
				children,
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

			// 省略标题的时候的提示
			const ons = ovTooltip
				? {
						onMouseenter() {},
						onMouseleave() {},
					}
				: {};

			// 如果为项集合
			const isGather = children && children.length > 0;
			if (isGather) {
				const childVNs = children.map((childItem, index) => (
					<FormConfigItem key={index} itemConfig={childItem}></FormConfigItem>
				));

				return childVNs.length ? (
					<div
						class={[
							'lt-form--gather lt-row',
							item.id,
							span ? `lt-col--${span} is--span` : '',
							className
								? isFunction(className)
									? className(params)
									: className
								: '',
						]}
					>
						{childVNs}
					</div>
				) : (
					createCommentVNode()
				);
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
							{...ons}
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
	},
});
</script>
