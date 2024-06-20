<script lang="tsx">
import { useTimeoutFn } from '@vueuse/core';
import { isNil } from 'lodash-es';
import {
	defineComponent,
	ref,
	type ExtractPropTypes,
	type PropType,
} from 'vue';
import { Skeleton } from 'ant-design-vue';
import { useNamespace } from '@lt-frame/hooks';
import Header from './header.vue';
import { LtTransition } from '../../transition';

const collapseContainerProps = {
	title: { type: String, default: '' },
	loading: { type: Boolean },
	canExpand: { type: Boolean, default: true },
	helpMessage: {
		type: [Array, String] as PropType<string[] | string>,
		default: '',
	},
	triggerWindowResize: { type: Boolean },
	lazyTime: { type: Number, default: 0 },
	headerClass: String,
	expand: { type: Boolean, default: true },
};

export type CollapseContainerProps = ExtractPropTypes<
	typeof collapseContainerProps
>;

function triggerWindowResize() {
	const event = document.createEvent('HTMLEvents');
	event.initEvent('resize', true, true);
	(event as any).eventType = 'message';
	window.dispatchEvent(event);
}

export default defineComponent({
	name: 'LtCollapse',
	props: collapseContainerProps,
	setup(props, { expose, slots }) {
		const show = ref(props.expand);

		const ns = useNamespace('collapse');

		const handleExpand = (val: boolean) => {
			show.value = isNil(val) ? !show.value : val;
			if (props.triggerWindowResize) {
				// 200 milliseconds here is because the expansion has animation,
				useTimeoutFn(triggerWindowResize, 200);
			}
		};

		expose({ handleExpand });
		return () => (
			<div class={ns.b()}>
				<Header
					{...props}
					prefixCls={ns.b()}
					onExpand={handleExpand}
					show={show.value}
					v-slots={{
						title: slots.title,
						action: slots.action,
					}}
					class={[props.headerClass]}
				/>

				<div class={ns.e('content')}>
					<LtTransition enable={props.canExpand}>
						{props.loading ? (
							<Skeleton active={props.loading} />
						) : (
							<div class={ns.e('body')} v-show={show.value}>
								{slots.default?.()}
							</div>
						)}
					</LtTransition>
				</div>

				{slots.footer && <div class={ns.e('footer')}>{slots.footer()}</div>}
			</div>
		);
	},
});
</script>
