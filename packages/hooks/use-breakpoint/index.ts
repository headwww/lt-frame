import { ComputedRef, computed, ref, unref } from 'vue';
import { useEventListener } from '../use-event-listener';

export enum sizeEnum {
	XS = 'XS',
	SM = 'SM',
	MD = 'MD',
	LG = 'LG',
	XL = 'XL',
	XXL = 'XXL',
}

export enum screenEnum {
	XS = 480,
	SM = 576,
	MD = 768,
	LG = 992,
	XL = 1200,
	XXL = 1600,
}

const screenMap = new Map<sizeEnum, number>();

screenMap.set(sizeEnum.XS, screenEnum.XS);
screenMap.set(sizeEnum.SM, screenEnum.SM);
screenMap.set(sizeEnum.MD, screenEnum.MD);
screenMap.set(sizeEnum.LG, screenEnum.LG);
screenMap.set(sizeEnum.XL, screenEnum.XL);
screenMap.set(sizeEnum.XXL, screenEnum.XXL);

export { screenMap };

let globalScreenRef: ComputedRef<sizeEnum | undefined>;
let globalWidthRef: ComputedRef<number>;
let globalRealWidthRef: ComputedRef<number>;

export interface CreateCallbackParams {
	screen: ComputedRef<sizeEnum | undefined>;
	width: ComputedRef<number>;
	realWidth: ComputedRef<number>;
	screenEnum: typeof screenEnum;
	screenMap: Map<sizeEnum, number>;
	sizeEnum: typeof sizeEnum;
}

/**
 * 响应式地获取和监听屏幕尺寸
 * @returns
 * screenRef: 返回当前屏幕尺寸的引用。
 * widthRef: 返回当前屏幕尺寸对应的宽度值。
 * realWidthRef: 返回窗口实际的宽度值。
 * screenEnum: 屏幕尺寸的枚举类型，包含了 XS、SM、MD、LG、XL、XXL。
 * realWidthRef: 返回全局窗口的实际宽度。
 */
export function useBreakpoint() {
	return {
		screenRef: computed(() => unref(globalScreenRef)),
		widthRef: globalWidthRef,
		screenEnum,
		realWidthRef: globalRealWidthRef,
	};
}

export function createBreakpointListen(
	fn?: (opt: CreateCallbackParams) => void
) {
	const screenRef = ref<sizeEnum>(sizeEnum.XL);
	const realWidthRef = ref(window.innerWidth);
	// 获取body元素的尺寸
	function getWindowWidth() {
		const width = document.body.clientWidth;
		const xs = screenMap.get(sizeEnum.XS)!;
		const sm = screenMap.get(sizeEnum.SM)!;
		const md = screenMap.get(sizeEnum.MD)!;
		const lg = screenMap.get(sizeEnum.LG)!;
		const xl = screenMap.get(sizeEnum.XL)!;
		if (width < xs) {
			screenRef.value = sizeEnum.XS;
		} else if (width < sm) {
			screenRef.value = sizeEnum.SM;
		} else if (width < md) {
			screenRef.value = sizeEnum.MD;
		} else if (width < lg) {
			screenRef.value = sizeEnum.LG;
		} else if (width < xl) {
			screenRef.value = sizeEnum.XL;
		} else {
			screenRef.value = sizeEnum.XXL;
		}
		realWidthRef.value = width;
	}

	useEventListener({
		el: window,
		name: 'resize',
		listener: () => {
			getWindowWidth();
			resizeFn();
		},
	});

	getWindowWidth();

	globalScreenRef = computed(() => unref(screenRef));
	globalWidthRef = computed((): number => screenMap.get(unref(screenRef)!)!);
	globalRealWidthRef = computed((): number => unref(realWidthRef));

	function resizeFn() {
		fn?.({
			screen: globalScreenRef,
			width: globalWidthRef,
			realWidth: globalRealWidthRef,
			screenEnum,
			screenMap,
			sizeEnum,
		});
	}
	resizeFn();
	return {
		screenRef: globalScreenRef,
		screenEnum,
		widthRef: globalWidthRef,
		realWidthRef: globalRealWidthRef,
	};
}
