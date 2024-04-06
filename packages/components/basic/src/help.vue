<script lang="tsx">
import { CSSProperties, computed, defineComponent, unref } from 'vue';
import { Tooltip } from 'ant-design-vue';
import { isArray, isString, getPopupContainer, getSlot } from '@lt-frame/utils';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { useNamespace } from '@lt-frame/hooks';
import { helpProps } from './help';

export default defineComponent({
	name: 'LtHelp',
	components: { Tooltip },
	props: helpProps,
	setup(props, { slots }) {
		const ns = useNamespace('help');

		const getTooltipStyle = computed(
			(): CSSProperties => ({ color: props.color, fontSize: props.fontSize })
		);

		const getOverlayStyle = computed(
			(): CSSProperties => ({ maxWidth: props.maxWidth })
		);

		function renderTitle() {
			const textList = props.text;

			if (isString(textList)) {
				return <p>{textList}</p>;
			}

			if (isArray(textList)) {
				return textList.map((text, index) => (
					<p key={text}>
						<>
							{props.showIndex ? `${index + 1}. ` : ''}
							{text}
						</>
					</p>
				));
			}
			return null;
		}

		return () => (
			<Tooltip
				overlayClassName={ns.e('wrap')}
				title={<div style={unref(getTooltipStyle)}>{renderTitle()}</div>}
				autoAdjustOverflow={true}
				overlayStyle={unref(getOverlayStyle)}
				placement={props.placement as 'right'}
				getPopupContainer={() => getPopupContainer()}
			>
				<span class={ns.b()}>{getSlot(slots) || <InfoCircleOutlined />}</span>
			</Tooltip>
		);
	},
});
</script>
