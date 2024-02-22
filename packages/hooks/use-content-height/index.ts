import { ComputedRef, Ref, isRef, nextTick, ref, unref } from 'vue';
import { isNumber, isString } from 'lodash-es';
import { getViewportOffset, onMountedOrActivated } from '@lt-frame/utils';
import { useWindowSizeFn } from '../use-window-size';

type Upward = number | string | null | undefined;

/**
 * 动态计算内容高度，根据锚点dom最下坐标到屏幕最下坐标，根据传入dom的高度、padding、margin等值进行动态计算
 * 最终获取合适的内容高度
 * @param flag 用于开启计算的响应式标识
 * @param anchorRef 锚点组件 Ref<ElRef | ComponentRef>
 * @param subtractHeightRefs 待减去高度的组件列表 Ref<ElRef | ComponentRef>
 * @param substractSpaceRefs 待减去空闲空间(margins/paddings)的组件列表 Ref<ElRef | ComponentRef>
 * @param upwardSpace 计算偏移的响应式高度，计算高度时将直接减去此值
 * @param offsetHeightRef 向上递归减去空闲空间的 层级 或 直到指定class为止 数值为2代表向上递归两次|数值为ant-layout表示向上递归直到碰见.ant-layout为止
 * @returns 响应式高度
 */
export function useContentHeight(
	flag: ComputedRef<Boolean>,
	anchorRef: Ref,
	subtractHeightRefs: Ref[],
	substractSpaceRefs: Ref[],
	upwardSpace: Ref<Upward> | ComputedRef<Upward> | Upward = 0,
	offsetHeightRef: Ref<number> = ref(0)
) {
	const contentHeight: Ref<number | null> = ref(null);

	// 计算给定元素在指定方向（上方、下方、或全部方向）上的外边距和内边距之和
	function calcSubtractSpace(
		element: Element | null | undefined,
		direction: 'all' | 'top' | 'bottom' = 'all'
	): number {
		function numberPx(px: string) {
			return Number(px.replace(/[^\d]/g, ''));
		}
		let subtractHeight = 0;
		const ZERO_PX = '0px';
		if (element) {
			const cssStyle = getComputedStyle(element);
			const marginTop = numberPx(cssStyle?.marginTop ?? ZERO_PX);
			const marginBottom = numberPx(cssStyle?.marginBottom ?? ZERO_PX);
			const paddingTop = numberPx(cssStyle?.paddingTop ?? ZERO_PX);
			const paddingBottom = numberPx(cssStyle?.paddingBottom ?? ZERO_PX);
			if (direction === 'all') {
				subtractHeight += marginTop;
				subtractHeight += marginBottom;
				subtractHeight += paddingTop;
				subtractHeight += paddingBottom;
			} else if (direction === 'top') {
				subtractHeight += marginTop;
				subtractHeight += paddingTop;
			} else {
				subtractHeight += marginBottom;
				subtractHeight += paddingBottom;
			}
		}
		return subtractHeight;
	}

	// 获取当前 HTML 元素
	function getEl(element: any): HTMLDivElement | null {
		if (element == null) {
			return null;
		}
		return (
			element instanceof HTMLDivElement ? element : element.$el
		) as HTMLDivElement;
	}

	// 计算内容高度
	async function calcContentHeight() {
		if (!flag.value) {
			return;
		}
		// 添加延迟以获得正确的高度
		await nextTick();
		const anchorEl = getEl(unref(anchorRef));
		if (!anchorEl) {
			return;
		}
		const { bottomIncludeBody } = getViewportOffset(anchorEl);

		// 子元素高度 目前只有PageHeader的高度，后期可能会添加PageFooter
		let substractHeight = 0;
		subtractHeightRefs.forEach((item) => {
			substractHeight += getEl(unref(item))?.offsetHeight ?? 0;
		});

		// 内容区域的margins / paddings
		let substractSpaceHeight = calcSubtractSpace(anchorEl) ?? 0;
		substractSpaceRefs.forEach((item) => {
			substractSpaceHeight += calcSubtractSpace(getEl(unref(item)));
		});

		// 计算一个元素向上追溯到指定级别或指定类名的祖先元素时，所占用的上方空间高度
		/**
         <div style="padding-top: 50px">
            <PageWrapper
              title="VxeTable表格"
              :upwardSpace="1"
            />
        </div>
        当PageWrapper的upwardSpaces设置0的时候则父元素的padding-top就不会考虑在内
        当设置是1的时候则考虑父元素的padding-top 以此类推设置数值越大考虑到的祖先元素越多
         */
		let upwardSpaceHeight = 0;
		function upward(
			element: Element | null,
			upwardLvlOrClass: number | string | null | undefined
		) {
			if (element && upwardLvlOrClass) {
				const parent = element.parentElement;
				if (parent) {
					if (isString(upwardLvlOrClass)) {
						if (!parent.classList.contains(upwardLvlOrClass)) {
							upwardSpaceHeight += calcSubtractSpace(parent, 'bottom');
							upward(parent, upwardLvlOrClass);
						} else {
							upwardSpaceHeight += calcSubtractSpace(parent, 'bottom');
						}
					} else if (isNumber(upwardLvlOrClass)) {
						if (upwardLvlOrClass > 0) {
							upwardSpaceHeight += calcSubtractSpace(parent, 'bottom');
							// eslint-disable-next-line no-plusplus
							upward(parent, --upwardLvlOrClass);
						}
					}
				}
			}
		}
		if (isRef(upwardSpace)) {
			upward(anchorEl, unref(upwardSpace));
		} else {
			upward(anchorEl, upwardSpace);
		}
		const height =
			bottomIncludeBody -
			unref(offsetHeightRef) -
			substractHeight -
			substractSpaceHeight -
			upwardSpaceHeight;

		contentHeight.value = height;
	}

	function redoHeight() {
		nextTick(() => {
			calcContentHeight();
		});
	}

	onMountedOrActivated(() => {
		nextTick(() => {
			calcContentHeight();
		});
	});

	useWindowSizeFn(
		() => {
			calcContentHeight();
		},
		{ wait: 50, immediate: true }
	);
	return { contentHeight, redoHeight };
}
