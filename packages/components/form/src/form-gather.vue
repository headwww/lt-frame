<script lang="tsx">
import {
	Ref,
	defineComponent,
	inject,
	onMounted,
	onUnmounted,
	provide,
	reactive,
	ref,
} from 'vue';
import { formItemProps } from './form-item';
import { FormPrivateMethods, LtFormConstructor } from './form';
import {
	LtFormItemProvide,
	assemItem,
	createItem,
	destroyItem,
	watchItem,
} from './util';

export default defineComponent({
	name: 'LtFormGather',
	props: formItemProps,
	setup(props, { slots }) {
		const refElem = ref() as Ref<HTMLDivElement>;
		const $ltform = inject(
			'$ltform',
			{} as LtFormConstructor & FormPrivateMethods
		);
		const formGather = inject(
			'$ltformgather',
			null as LtFormItemProvide | null
		);
		const defaultSlot = slots.default;
		const formItem = reactive(createItem($ltform, props));
		const ltformitem: LtFormItemProvide = { formItem };
		const ltformiteminfo = { itemConfig: formItem };
		formItem.children = [];

		provide('$ltformiteminfo', ltformiteminfo);
		provide('$ltformgather', ltformitem);
		provide('$ltformitem', null);

		watchItem(props, formItem);

		onMounted(() => {
			assemItem($ltform, refElem.value, formItem, formGather);
		});

		onUnmounted(() => {
			destroyItem($ltform, formItem);
		});

		const renderVN = () => (
			<div ref={refElem}>{defaultSlot ? defaultSlot() : []}</div>
		);
		return () => renderVN();
	},
});
</script>
