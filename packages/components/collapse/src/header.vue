<script lang="tsx">
import { useNamespace } from '@lt-frame/hooks';
import {
	ExtractPropTypes,
	PropType,
	computed,
	defineComponent,
	unref,
} from 'vue';
import { LtTitle, LtArrow } from '../../basic';

const collapseHeaderProps = {
	prefixCls: String,
	title: String,
	show: Boolean,
	canExpand: Boolean,
	helpMessage: {
		type: [Array, String] as PropType<string[] | string>,
		default: '',
	},
};

export type CollapseHeaderProps = ExtractPropTypes<typeof collapseHeaderProps>;

export default defineComponent({
	name: 'CollapseHeader',
	inheritAttrs: false,
	props: collapseHeaderProps,
	emits: ['expand'],
	setup(props, { slots, attrs, emit }) {
		const ns = useNamespace('collapse-container');
		const _prefixCls = computed(() => props.prefixCls || ns.b());
		return () => (
			<div class={[`${unref(_prefixCls)}__header`, attrs.class]}>
				<LtTitle helpMessage={props.helpMessage} normal>
					{slots.title?.() || props.title}
				</LtTitle>
				<div class={`${unref(_prefixCls)}__action`}>
					{slots.action
						? slots.action({
								expand: props.show,
								onClick: () => emit('expand'),
							})
						: props.canExpand && (
								<LtArrow
									up
									expand={props.show}
									onClick={() => emit('expand')}
								/>
							)}
				</div>
			</div>
		);
	},
});
</script>
