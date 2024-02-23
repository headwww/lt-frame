import {
	computed,
	getCurrentInstance,
	nextTick,
	onUnmounted,
	reactive,
	ref,
	toRaw,
	unref,
	watchEffect,
} from 'vue';
import { isEqual, isFunction } from 'lodash-es';
import { tryOnUnmounted } from '@vueuse/core';
import { Fn, Nullable } from '@lt-frame/utils';
import {
	ModalMethods,
	ModalReturnMethods,
	UseModalInnerReturnType,
	UseModalReturnType,
} from '../typing';
import { BaseModalProps } from '../components/base-modal';

// modal父子组件之间传递数据
const dataTransfer = reactive<any>({});

// 记录modal的开关状态，根据uid来判断是哪个modal
const openData = reactive<{ [key: number]: boolean }>({});

export function useModal(): UseModalReturnType {
	const modal = ref<Nullable<ModalMethods>>(null);
	const uid = ref<number>(0);
	// 跟踪modal是否已经加载
	const loaded = ref<Nullable<boolean>>(false);

	function register(modalMethod: ModalMethods, uuid: number) {
		if (!getCurrentInstance()) {
			throw new Error('useModal()只能在setup()或功能组件内部使用!');
		}
		uid.value = uuid;
		// 生产环境释放资源
		process.env.NODE_ENV === 'production' &&
			onUnmounted(() => {
				modal.value = null;
				loaded.value = false;
				dataTransfer[String(unref(uid))] = null;
			});
		if (
			unref(loaded) &&
			process.env.NODE_ENV === 'production' &&
			modalMethod === unref(modal)
		)
			return;
		modal.value = modalMethod;
		loaded.value = true;
		modalMethod.emitOpen = (open: boolean, uid: number) => {
			openData[uid] = open;
		};
	}

	const getInstance = () => {
		const instance = unref(modal);
		if (!instance) {
			throw new Error('useModal实例未定义!');
		}
		return instance;
	};

	const methons: ModalReturnMethods = {
		setModalProps(props: Partial<BaseModalProps>): void {
			getInstance().setModalProps(props);
		},

		getOpen: computed((): boolean => openData[~~unref(uid)]),

		redoModalHeight: () => {
			getInstance()?.redoModalHeight?.();
		},
		/**
		 *
		 * @param open 打开modal
		 * @param data 传递值
		 * @param openOnSet 开启传值
		 */
		openModal: <T = any>(open = true, data?: T, openOnSet = true): void => {
			getInstance()?.setModalProps({
				open,
			});
			if (!data) return;
			const id = unref(uid);
			if (openOnSet) {
				dataTransfer[id] = null;
				dataTransfer[id] = toRaw(data);
				return;
			}
			const equal = isEqual(toRaw(dataTransfer[id]), toRaw(data));
			if (!equal) {
				dataTransfer[id] = toRaw(data);
			}
		},

		closeModal(): void {
			getInstance()?.setModalProps({ open: false });
		},
	};
	return [register, methons];
}

// Modal大多数为单独的组件，提供useModalInner从Modal组件内部操控Modal
export const useModalInner = (callbackFn?: Fn): UseModalInnerReturnType => {
	const modalInstanceRef = ref<Nullable<ModalMethods>>(null);
	const uidRef = ref<number>(0);
	const currentInstance = getCurrentInstance();

	const getInstance = () => {
		const instance = unref(modalInstanceRef);
		if (!instance) {
			throw new Error('useModalInner instance is undefined!');
		}
		return instance;
	};

	const register = (modalInstance: ModalMethods, uuid: number) => {
		process.env.NODE_ENV === 'production' &&
			tryOnUnmounted(() => {
				modalInstanceRef.value = null;
			});
		uidRef.value = uuid;
		modalInstanceRef.value = modalInstance;
		// 激活modal父组件中的@register的监听事件
		currentInstance?.emit('register', modalInstance, uuid);
	};

	watchEffect(() => {
		const data = dataTransfer[unref(uidRef)];
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
				getInstance()?.setModalProps({ loading });
			},
			changeOkLoading: (loading = true) => {
				getInstance()?.setModalProps({ confirmLoading: loading });
			},
			getOpen: computed((): boolean => openData[~~unref(uidRef)]),
			setModalProps: (props: Partial<BaseModalProps>) => {
				getInstance()?.setModalProps(props);
			},
			closeModal: () => {
				getInstance()?.setModalProps({ open: false });
			},
			redoModalHeight: () => {
				const callRedo = getInstance()?.redoModalHeight;
				callRedo && callRedo();
			},
		},
	];
};
