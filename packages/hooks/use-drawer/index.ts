import {
	computed,
	getCurrentInstance,
	nextTick,
	reactive,
	ref,
	toRaw,
	unref,
	watchEffect,
} from 'vue';
import { tryOnUnmounted } from '@vueuse/core';
import { isEqual, isFunction } from 'lodash-es';
import {
	DrawerInstance,
	DrawerProps,
	ReturnMethods,
	UseDrawerInnerReturnType,
	UseDrawerReturnType,
} from '@lt-frame/components';
import { Fn, Nullable } from '@lt-frame/utils';

const dataTransferRef = reactive<any>({});

const openData = reactive<{ [key: number]: boolean }>({});

export function useDrawer(): UseDrawerReturnType {
	if (!getCurrentInstance()) {
		throw new Error('useDrawer()只能在setup()或功能组件内部使用!');
	}
	const uid = ref<number>(0);
	const loaded = ref<Nullable<boolean>>(false);
	const drawer = ref<DrawerInstance | null>(null);

	function register(drawerInstance: DrawerInstance, uuid: number) {
		process.env.NODE_ENV === 'production' &&
			tryOnUnmounted(() => {
				drawer.value = null;
				loaded.value = null;
				dataTransferRef[unref(uid)] = null;
			});
		if (
			unref(loaded) &&
			process.env.NODE_ENV === 'production' &&
			drawerInstance === unref(drawer)
		) {
			return;
		}
		uid.value = uuid;
		drawer.value = drawerInstance;
		loaded.value = true;
		drawerInstance.emitOpen = (open: boolean, uid: number) => {
			openData[uid] = open;
		};
	}

	const getInstance = () => {
		const instance = unref(drawer);
		if (!instance) {
			throw new Error('useDrawer instance is undefined!');
		}
		return instance;
	};
	const methods: ReturnMethods = {
		setDrawerProps: (props: Partial<DrawerProps>): void => {
			getInstance()?.setDrawerProps(props);
		},
		getOpen: computed((): boolean => true),
		closeDrawer: () => {
			getInstance()?.setDrawerProps({ open: false });
		},
		openDrawer: <T = any>(open = true, data?: T, openOnSet = true): void => {
			getInstance()?.setDrawerProps({
				open,
			});
			if (!data) return;

			if (openOnSet) {
				dataTransferRef[unref(uid)] = null;
				dataTransferRef[unref(uid)] = toRaw(data);
				return;
			}
			const equal = isEqual(toRaw(dataTransferRef[unref(uid)]), toRaw(data));
			if (!equal) {
				dataTransferRef[unref(uid)] = toRaw(data);
			}
		},
	};
	return [register, methods];
}

export const useDrawerInner = (callbackFn?: Fn): UseDrawerInnerReturnType => {
	const drawerInstanceRef = ref<Nullable<DrawerInstance>>(null);
	const currentInstance = getCurrentInstance();
	const uidRef = ref<number>(0);

	if (!getCurrentInstance()) {
		throw new Error(
			'useDrawerInner() can only be used inside setup() or functional components!'
		);
	}

	const getInstance = () => {
		const instance = unref(drawerInstanceRef);
		if (!instance) {
			throw new Error('useDrawerInner instance is undefined!');
		}
		return instance;
	};

	const register = (modalInstance: DrawerInstance, uuid: number) => {
		process.env.NODE_ENV === 'production' &&
			tryOnUnmounted(() => {
				drawerInstanceRef.value = null;
			});

		uidRef.value = uuid;
		drawerInstanceRef.value = modalInstance;
		currentInstance?.emit('register', modalInstance, uuid);
	};

	watchEffect(() => {
		const data = dataTransferRef[unref(uidRef)];
		if (!data) return;
		if (!callbackFn || !isFunction(callbackFn)) return;
		nextTick(() => {
			callbackFn(data);
		});
	});

	return [
		register,
		{
			changeLoading: (loading = true) => {
				getInstance()?.setDrawerProps({ loading });
			},

			changeOkLoading: (loading = true) => {
				getInstance()?.setDrawerProps({ confirmLoading: loading });
			},
			getOpen: computed((): boolean => openData[~~unref(uidRef)]),

			closeDrawer: () => {
				getInstance()?.setDrawerProps({ open: false });
			},

			setDrawerProps: (props: Partial<DrawerProps>) => {
				getInstance()?.setDrawerProps(props);
			},
		},
	];
};
