<script lang="ts">
import { computed, defineComponent, h, unref } from 'vue';
import { Popconfirm } from 'ant-design-vue';
import { omit } from 'lodash-es';
import { extendSlots } from '@lt-frame/utils';
import { useAttrs } from '@lt-frame/hooks';
import LtButton from './button.vue';
import { popConfirmButtonProps } from './pop-confirm-button';

export default defineComponent({
	name: 'LtPopConfirmButton',
	inheritAttrs: false,
	props: popConfirmButtonProps,
	setup(props, { slots }) {
		const attrs = useAttrs();

		const getBindValues = computed(() => ({
			okText: '确认',
			cancelText: '取消',
			...props,
			...unref(attrs),
		}));

		return () => {
			const bindValues = omit(unref(getBindValues), 'icon');
			const btnBind = omit(bindValues, 'title') as any;
			if (btnBind.disabled) btnBind.color = '';
			const Button = h(LtButton, btnBind, extendSlots(slots));

			if (!props.enable) {
				return Button;
			}
			return h(Popconfirm, bindValues, { default: () => Button });
		};
	},
});
</script>
