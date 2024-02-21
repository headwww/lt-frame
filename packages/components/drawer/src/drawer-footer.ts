import { Recordable } from '@lt-frame/utils';
import { PropType } from 'vue';

export const drawerFooterProps = {
	confirmLoading: { type: Boolean },
	showCancelBtn: { type: Boolean, default: true },
	cancelButtonProps: Object as PropType<Recordable>,
	cancelText: { type: String, default: '取消' },
	showOkBtn: { type: Boolean, default: true },
	okButtonProps: Object as PropType<Recordable>,
	okText: { type: String, default: '确定' },
	okType: { type: String, default: 'primary' },
	showFooter: { type: Boolean },
	footerHeight: {
		type: [String, Number] as PropType<string | number>,
		default: 60,
	},
};
