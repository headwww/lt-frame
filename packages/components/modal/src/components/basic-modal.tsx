import { defineComponent, toRefs, unref } from 'vue';
import { Modal } from 'ant-design-vue';
import { useAttrs } from '@lt-frame/hooks';
import { extendSlots } from '@lt-frame/utils';
import { useModalDragMove } from '../hooks/useModalDrag';
import { basicProps } from './base-modal';

export default defineComponent({
	name: 'Modal',
	inheritAttrs: false,
	emits: ['cancel'],
	props: basicProps as any,
	setup(props, { slots, emit }) {
		const attrs = useAttrs();
		const onCancel = (e: Event) => {
			emit('cancel', e);
		};
		const { open, draggable, destroyOnClose } = toRefs(props);

		useModalDragMove({
			open,
			destroyOnClose,
			draggable,
		});

		return () => {
			const propsData = { ...unref(attrs), ...props, onCancel };
			return <Modal {...propsData}>{extendSlots(slots)}</Modal>;
		};
	},
});
