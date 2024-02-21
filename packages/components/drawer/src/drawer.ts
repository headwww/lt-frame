import { CSSProperties, ComputedRef, PropType } from 'vue';
import { ScrollbarInstance } from '../../scrollbar';
import { ButtonProps } from '../../button';
import { drawerFooterProps } from './drawer-footer';

export const drawerProps = {
	isDetail: { type: Boolean },
	title: { type: String, default: '' },
	loading: { type: Boolean },
	loadingText: { type: String },
	showDetailBack: { type: Boolean, default: true },
	open: { type: Boolean },
	maskClosable: { type: Boolean, default: true },
	getContainer: {
		type: [Object, String] as PropType<any>,
	},
	closeFunc: {
		type: [Function, Object] as PropType<any>,
		default: null,
	},
	destroyOnClose: { type: Boolean },
	...drawerFooterProps,
};

export interface DrawerInstance {
	setDrawerProps: (props: Partial<DrawerProps>) => void;
	emitOpen?: (open: boolean, uid: number) => void;
}

export interface ReturnMethods extends DrawerInstance {
	openDrawer: <T = any>(open?: boolean, data?: T, openOnSet?: boolean) => void;
	closeDrawer: () => void;
	getOpen?: ComputedRef<boolean>;
}

export type RegisterFn = (drawerInstance: DrawerInstance, uuid: number) => void;

export interface ReturnInnerMethods extends DrawerInstance {
	closeDrawer: () => void;
	changeLoading: (loading: boolean) => void;
	changeOkLoading: (loading: boolean) => void;
	getOpen?: ComputedRef<boolean>;
}

export type UseDrawerReturnType = [RegisterFn, ReturnMethods];

export type UseDrawerInnerReturnType = [RegisterFn, ReturnInnerMethods];

export interface DrawerFooterProps {
	showOkBtn: boolean;
	showCancelBtn: boolean;
	cancelText: string;
	okText: string;
	okType: 'primary' | 'danger' | 'dashed' | 'ghost' | 'default';
	okButtonProps: { props: ButtonProps; on: {} };
	cancelButtonProps: { props: ButtonProps; on: {} };
	confirmLoading: boolean;
	showFooter: boolean;
	footerHeight: string | number;
}

export interface DrawerProps extends DrawerFooterProps {
	isDetail?: boolean;
	loading?: boolean;
	showDetailBack?: boolean;
	open?: boolean;
	scrollOptions?: ScrollbarInstance;
	closeFunc?: () => Promise<any>;
	triggerWindowResize?: boolean;
	closable?: boolean;
	destroyOnClose?: boolean;
	getContainer?: string | false | HTMLElement | (() => HTMLElement);
	mask?: boolean;
	maskClosable?: boolean;
	maskStyle?: CSSProperties;
	title?: string;
	wrapClassName?: string;
	class?: string;
	rootClassName?: string;
	wrapStyle?: CSSProperties;
	drawerStyle?: CSSProperties;
	bodyStyle?: CSSProperties;
	headerStyle?: CSSProperties;
	width?: string | number;
	height?: string | number;
	zIndex?: number;
	placement?: 'top' | 'right' | 'bottom' | 'left';
	afterOpenChange?: (open?: boolean) => void;
	keyboard?: boolean;
	onClose?: (e?: Event) => void;
}

export interface DrawerActionType {
	scrollBottom: () => void;
	scrollTo: (to: number) => void;
	getScrollWrap: () => Element | null;
}
