<script lang="tsx">
import {
	computed,
	defineComponent,
	nextTick,
	onBeforeUnmount,
	onMounted,
	provide,
	reactive,
	ref,
	watch,
} from 'vue';
import { isNaN, isNull, isString } from 'lodash-es';
import {
	ChangedPaneType,
	splitPanesProps,
	splitpanesKey,
	SplitpaneIndexedElementType,
	CoordinateType,
	SumsType,
	RequestUpdateType,
	SplitpaneIndexedType,
} from './splitpanes';
import { Pane } from './pane';

export default defineComponent({
	name: 'LtSplitPanes',
	props: splitPanesProps,
	emits: [
		'pane-add',
		'pane-remove',
		'ready',
		'resized',
		'resize',
		'splitter-click',
		'pane-maximize',
		'pane-click',
	],
	setup(props, { slots, emit }) {
		const container = ref<HTMLDivElement>();
		const panes = ref<Array<SplitpaneIndexedElementType>>([]);
		const ready = ref(false);

		const touch = reactive<{
			mouseDown: boolean;
			dragging: boolean;
			activeSplitter: number | null;
		}>({
			mouseDown: false,
			dragging: false,
			activeSplitter: null,
		});

		const splitterTaps = reactive<{
			splitter: number | null;
			timeoutId: number | null;
		}>({ splitter: null, timeoutId: null });

		provide(splitpanesKey, {
			onPaneAdd,
			onPaneRemove,
			onPaneClick,
			requestUpdate,
		});

		const panesCount = computed(() => panes.value.length);

		const indexedPanes = computed(() =>
			panes.value.reduce((obj, pane) => {
				obj[pane.id] = pane;
				return obj;
			}, {} as SplitpaneIndexedType)
		);

		function updatePaneComponents() {
			panes.value.forEach((pane) => {
				pane.update &&
					pane.update({
						[props.horizontal ? 'height' : 'width']: `${
							indexedPanes.value[pane.id].size
						}%`,
					});
			});
		}

		function bindEvents() {
			document.addEventListener('mousemove', onMouseMove, { passive: false });
			document.addEventListener('mouseup', onMouseUp);
			if ('ontouchstart' in window) {
				document.addEventListener('touchmove', onMouseMove, {
					passive: false,
				});
				document.addEventListener('touchend', onMouseUp);
			}
		}

		function unbindEvents() {
			document.removeEventListener('mousemove', onMouseMove, {
				passive: false,
			} as unknown as boolean);
			document.removeEventListener('mouseup', onMouseUp);

			if ('ontouchstart' in window) {
				document.removeEventListener('touchmove', onMouseMove, {
					passive: false,
				} as unknown as boolean);
				document.removeEventListener('touchend', onMouseUp);
			}
		}

		function onMouseMove(event: Event) {
			if (touch.mouseDown) {
				event.preventDefault();
				touch.dragging = true;
				calculatePanesSize(getCurrentMouseDrag(event));
				emit(
					'resize',
					panes.value.map((pane) => ({
						min: pane.min,
						max: pane.max,
						size: pane.size,
					}))
				);
			}
		}

		function onMouseUp() {
			if (touch.dragging) {
				emit(
					'resized',
					panes.value.map((pane) => ({
						min: pane.min,
						max: pane.max,
						size: pane.size,
					}))
				);
			}
			touch.mouseDown = false;
			setTimeout(() => {
				touch.dragging = false;
				unbindEvents();
			}, 100);
		}

		function sumPrevPanesSize(splitterIndex: number) {
			return panes.value.reduce(
				(total, pane, i) => total + (i < splitterIndex ? pane.size : 0),
				0
			);
		}

		function sumNextPanesSize(splitterIndex: number) {
			return panes.value.reduce(
				(total, pane, i) => total + (i > splitterIndex + 1 ? pane.size : 0),
				0
			);
		}

		/** 移动鼠标，计算pane尺寸 */
		function calculatePanesSize(drag: CoordinateType) {
			const splitterIndex = touch.activeSplitter ? touch.activeSplitter : 0;

			let sums = {
				prevPanesSize: sumPrevPanesSize(splitterIndex),
				nextPanesSize: sumNextPanesSize(splitterIndex),
				prevReachedMinPanes: 0,
				nextReachedMinPanes: 0,
			};

			const minDrag = 0 + (props.pushOtherPanes ? 0 : sums.prevPanesSize);
			const maxDrag = 100 - (props.pushOtherPanes ? 0 : sums.nextPanesSize);
			const dragPercentage = Math.max(
				Math.min(getCurrentDragPercentage(drag), maxDrag),
				minDrag
			);

			let panesToResize = [splitterIndex, splitterIndex + 1];
			let paneBefore = panes.value[panesToResize[0]] || null;
			let paneAfter = panes.value[panesToResize[1]] || null;

			const paneBeforeMaxReached =
				paneBefore.max < 100 &&
				dragPercentage >= paneBefore.max + sums.prevPanesSize;
			const paneAfterMaxReached =
				paneAfter.max < 100 &&
				dragPercentage <=
					100 - (paneAfter.max + sumNextPanesSize(splitterIndex + 1));
			if (paneBeforeMaxReached || paneAfterMaxReached) {
				if (paneBeforeMaxReached) {
					paneBefore.size = paneBefore.max;
					paneAfter.size = Math.max(
						100 - paneBefore.max - sums.prevPanesSize - sums.nextPanesSize,
						0
					);
				} else {
					paneBefore.size = Math.max(
						100 -
							paneAfter.max -
							sums.prevPanesSize -
							sumNextPanesSize(splitterIndex + 1),
						0
					);
					paneAfter.size = paneAfter.max;
				}
				return;
			}

			if (props.pushOtherPanes) {
				const vars = doPushOtherPanes(sums, dragPercentage);
				if (!vars) return;
				({ sums, panesToResize } = vars);

				paneBefore = panes.value[panesToResize[0]] || null;
				paneAfter = panes.value[panesToResize[1]] || null;
			}

			if (paneBefore !== null) {
				paneBefore.size = Math.min(
					Math.max(
						dragPercentage - sums.prevPanesSize - sums.prevReachedMinPanes,
						paneBefore.min
					),
					paneBefore.max
				);
			}
			if (paneAfter !== null) {
				paneAfter.size = Math.min(
					Math.max(
						100 -
							dragPercentage -
							sums.nextPanesSize -
							sums.nextReachedMinPanes,
						paneAfter.min
					),
					paneAfter.max
				);
			}
		}

		function doPushOtherPanes(sums: SumsType, dragPercentage: number) {
			const splitterIndex = touch.activeSplitter ? touch.activeSplitter : 0;
			const panesToResize = [splitterIndex, splitterIndex + 1];
			if (
				dragPercentage <
				sums.prevPanesSize + panes.value[panesToResize[0]].min
			) {
				panesToResize[0] = findPrevExpandedPane(splitterIndex).index;

				sums.prevReachedMinPanes = 0;
				if (panesToResize[0] < splitterIndex) {
					panes.value.forEach((pane, i) => {
						if (i > panesToResize[0] && i <= splitterIndex) {
							pane.size = pane.min;
							sums.prevReachedMinPanes += pane.min;
						}
					});
				}
				sums.prevPanesSize = sumPrevPanesSize(panesToResize[0]);
				if (panesToResize[0] === undefined) {
					sums.prevReachedMinPanes = 0;
					panes.value[0].size = panes.value[0].min;
					panes.value.forEach((pane, i) => {
						if (i > 0 && i <= splitterIndex) {
							pane.size = pane.min;
							sums.prevReachedMinPanes += pane.min;
						}
					});
					panes.value[panesToResize[1]].size =
						100 -
						sums.prevReachedMinPanes -
						panes.value[0].min -
						sums.prevPanesSize -
						sums.nextPanesSize;
					return null;
				}
			}
			if (
				dragPercentage >
				100 - sums.nextPanesSize - panes.value[panesToResize[1]].min
			) {
				panesToResize[1] = findNextExpandedPane(splitterIndex).index;
				sums.nextReachedMinPanes = 0;
				if (panesToResize[1] > splitterIndex + 1) {
					panes.value.forEach((pane, i) => {
						if (i > splitterIndex && i < panesToResize[1]) {
							pane.size = pane.min;
							sums.nextReachedMinPanes += pane.min;
						}
					});
				}
				sums.nextPanesSize = sumNextPanesSize(panesToResize[1] - 1);
				if (panesToResize[1] === undefined) {
					sums.nextReachedMinPanes = 0;
					panes.value[panesCount.value - 1].size =
						panes.value[panesCount.value - 1].min;
					panes.value.forEach((pane, i) => {
						if (i < panesCount.value - 1 && i >= splitterIndex + 1) {
							pane.size = pane.min;
							sums.nextReachedMinPanes += pane.min;
						}
					});
					panes.value[panesToResize[0]].size =
						100 -
						sums.prevPanesSize -
						sums.nextReachedMinPanes -
						panes.value[panesCount.value - 1].min -
						sums.nextPanesSize;
					return null;
				}
			}
			return { sums, panesToResize };
		}

		function findPrevExpandedPane(
			splitterIndex: number
		): SplitpaneIndexedElementType {
			const pane = [...panes.value]
				.reverse()
				.find((p) => p.index < splitterIndex && p.size > p.min);
			return pane || ({} as any);
		}

		function findNextExpandedPane(
			splitterIndex: number
		): SplitpaneIndexedElementType {
			const pane = panes.value.find(
				(p) => p.index > splitterIndex + 1 && p.size > p.min
			);
			return pane || ({} as any);
		}

		function getCurrentDragPercentage(drag: CoordinateType) {
			let d = drag[props.horizontal ? 'y' : 'x'];
			const h = props.horizontal ? 'clientHeight' : 'clientWidth';
			const containerSize = container.value!![h];
			if (props.rtl && !props.horizontal) d = containerSize - d;
			return (d * 100) / containerSize;
		}

		/** 获取鼠标在容器中的位置 */
		function getCurrentMouseDrag(event: any): CoordinateType {
			const rect = container.value!!.getBoundingClientRect();
			const { clientX, clientY } =
				'ontouchstart' in window && event.touches ? event.touches[0] : event;
			return {
				x: clientX - rect.left,
				y: clientY - rect.top,
			};
		}

		function onMouseDown(event: Event, splitterIndex: number) {
			bindEvents();
			// splitter被按下
			touch.mouseDown = true;
			touch.activeSplitter = splitterIndex;
		}

		function onSplitterClick(event: Event, splitterIndex: number) {
			if ('ontouchstart' in window) {
				event.preventDefault();

				if (props.dblClickSplitter) {
					if (splitterTaps.splitter === splitterIndex) {
						splitterTaps.timeoutId && clearTimeout(splitterTaps.timeoutId);
						splitterTaps.timeoutId = null;
						onSplitterDblClick(event, splitterIndex);
						splitterTaps.splitter = null;
					} else {
						splitterTaps.splitter = splitterIndex;
						splitterTaps.timeoutId = setTimeout(() => {
							splitterTaps.splitter = null;
						}, 500);
					}
				}
			}

			if (!touch.dragging) emit('splitter-click', panes.value[splitterIndex]);
		}

		function onSplitterDblClick(event: Event, splitterIndex: number) {
			let totalMinSizes = 0;
			panes.value = panes.value.map((pane, i) => {
				pane.size = i === splitterIndex ? pane.max : pane.min;
				if (i !== splitterIndex) totalMinSizes += pane.min;

				return pane;
			});
			panes.value[splitterIndex].size -= totalMinSizes;
			emit('pane-maximize', panes.value[splitterIndex]);
			emit(
				'resized',
				panes.value.map((pane) => ({
					min: pane.min,
					max: pane.max,
					size: pane.size,
				}))
			);
		}

		function onPaneClick(event: Event, paneId?: number) {
			emit('pane-click', paneId && indexedPanes.value[paneId]);
		}

		/** 添加分割器 */
		function addSplitter(
			paneIndex: number,
			nextPaneNode: HTMLElement,
			isVeryFirst: boolean = false
		) {
			const splitterIndex = paneIndex - 1;
			splitterIndex;
			const elm = document.createElement('div');
			elm.classList.add('splitpanes__splitter');
			if (!isVeryFirst) {
				// 新增分割器并且绑定事件
				elm.onmousedown = (event: MouseEvent) =>
					onMouseDown(event, splitterIndex);
				// 移动端的触摸事件
				if (typeof window !== 'undefined' && 'ontouchstart' in window) {
					elm.ontouchstart = (ev: TouchEvent) => onMouseDown(ev, splitterIndex);
				}
				elm.onclick = (event: MouseEvent) =>
					onSplitterClick(event, splitterIndex + 1);
			}

			if (props.dblClickSplitter) {
				elm.ondblclick = (event: MouseEvent) =>
					onSplitterDblClick(event, splitterIndex + 1);
			}

			// 是否添加双击放大事件
			nextPaneNode.parentNode?.insertBefore(elm, nextPaneNode);
		}

		function requestUpdate(update: RequestUpdateType) {
			const { target, min, max, size } = update;
			if (target.uid) {
				const pane = indexedPanes.value[target.uid];
				if (max) pane.max = max;
				if (min) pane.min = min;
				if (size) pane.size = size;
			}
		}

		function onPaneAdd(pane: Pane) {
			let index = -1;
			const { el } = pane;
			if (el && el.parentNode) {
				// 判断pane在dom中的位置
				Array.from(el.parentNode.children).some((e) => {
					if (e.className.includes('splitpanes__pane')) index += 1;
					return e === pane.el;
				});
				// 将Pane添加到与插入＜splitpanes＞标记的索引相同的数组中。
				const min = isString(pane.minSize)
					? parseFloat(pane.minSize)
					: pane.minSize;
				const max = isString(pane.maxSize)
					? parseFloat(pane.maxSize)
					: pane.maxSize;
				const size = isString(pane.size) ? parseFloat(pane.size) : pane.size;
				const obj = {
					index,
					id: pane.uid,
					min: isNaN(min) ? 0 : min,
					max: isNaN(max) ? 0 : max,
					size: isNull(pane.size) ? null : size,
					givenSize: size,
					update: pane.update,
				} as SplitpaneIndexedElementType;
				panes.value.splice(index, 0, obj);
				// 插入其他pane的后恢复索引
				panes.value.forEach((item, index) => {
					item.index = index;
				});
				if (ready.value) {
					nextTick(() => {
						redoSplitters();
						resetPaneSizes({ addedPane: panes.value[index] });
						emit('pane-add', {
							index,
							panes: panes.value.map((pane) => ({
								min: pane.min,
								max: pane.max,
								size: pane.size,
							})),
						});
					});
				}
			}
		}

		function onPaneRemove(pane: Pane) {
			const index = panes.value.findIndex((p) => p.id === pane.uid);
			const removed = panes.value.splice(index, 1)[0];
			panes.value.forEach((p, i) => {
				p.index = i;
			});
			nextTick(() => {
				redoSplitters();
				resetPaneSizes({ removedPane: { ...removed, index } });
				emit('pane-remove', {
					index,
					panes: panes.value.map((pane) => ({
						min: pane.min,
						max: pane.max,
						size: pane.size,
					})),
				});
			});
		}

		/** 移除子组件不是splitPanes和pane的 */
		function checkSplitpanesNodes() {
			if (container.value) {
				const children = Array.from(container.value.children);
				children.forEach((child) => {
					const isPane = child.classList.contains('splitpanes__pane');
					const isSplitter = child.classList.contains('splitpanes__splitter');
					if (!isPane && !isSplitter) {
						child.parentNode?.removeChild(child);
						// eslint-disable-next-line no-console
						console.warn(
							'在<LtSplitpanes>的根目录中只允许使用<LtPane>或者<LtSplitpanes>元素。您的一个DOM节点已删除。'
						);
					}
				});
			}
		}

		function removeSplitter(node: HTMLElement) {
			node.onmousedown = null;
			node.onclick = null;
			node.ondblclick = null;
			node.parentNode?.removeChild(node);
		}

		/** 重置分割器，并且控制是否插入分割器 */
		function redoSplitters() {
			if (container.value) {
				const children = Array.from(container.value.children);

				children.forEach((el) => {
					if (el.className.includes('splitpanes__splitter'))
						removeSplitter(el as HTMLElement);
				});
				let paneIndex = 0;
				children.forEach((el) => {
					if (el.className.includes('splitpanes__pane')) {
						if (!paneIndex && props.firstSplitter) {
							// 特殊处理第一个pane 给他加上一个split来控制双击放大
							addSplitter(paneIndex, el as HTMLElement, true);
						} else if (paneIndex) {
							addSplitter(paneIndex, el as HTMLElement);
						}
						paneIndex += 1;
					}
				});
			}
		}

		/** 重置面板的大小 */
		function resetPaneSizes(changedPanes: ChangedPaneType = {}) {
			if (!changedPanes.addedPane && !changedPanes.removedPane) {
				initialPanesSizing();
			} else if (
				panes.value.some(
					(pane) => pane.givenSize !== null || pane.min || pane.max < 100
				)
			) {
				equalizeAfterAddOrRemove(changedPanes);
			} else {
				equalize();
			}
			if (ready.value)
				emit(
					'resized',
					panes.value.map((pane) => ({
						min: pane.min,
						max: pane.max,
						size: pane.size,
					}))
				);
		}

		function equalize() {
			const equalSpace = 100 / panesCount.value;
			let leftToAllocate = 0;
			const ungrowable: number[] = [];
			const unshrinkable: number[] = [];

			panes.value.forEach((pane) => {
				pane.size = Math.max(Math.min(equalSpace, pane.max), pane.min);

				leftToAllocate -= pane.size;
				if (pane.size >= pane.max) ungrowable.push(pane.id);
				if (pane.size <= pane.min) unshrinkable.push(pane.id);
			});

			if (leftToAllocate > 0.1)
				readjustSizes(leftToAllocate, ungrowable, unshrinkable);
		}

		/** 设置pane的size */
		function initialPanesSizing() {
			// 初始化为 100，表示面板总大小或可用空间为 100%
			let leftToAllocate = 100;
			// 分别用来存储那些已经达到最大大小（不能再增长）和已经达到最小大小（不能再缩小）的面板的 ID。
			const ungrowable: number[] = [];
			const unshrinkable: number[] = [];
			// 用于记录已经设置了大小的面板数量
			let definedSizes = 0;

			// 检查预分配的空间是否为100%。
			panes.value.forEach((pane) => {
				leftToAllocate -= pane.size;
				if (!isNull(pane.size)) definedSizes += 1;
				if (pane.size >= pane.max) ungrowable.push(pane.id);
				if (pane.size <= pane.min) unshrinkable.push(pane.id);
			});

			// 没size的pane设置一下size
			let leftToAllocate2 = 100;
			if (leftToAllocate > 0.1) {
				panes.value.forEach((pane) => {
					if (isNull(pane.size)) {
						pane.size = Math.max(
							Math.min(
								leftToAllocate / (panesCount.value - definedSizes),
								pane.max
							),
							pane.min
						);
					}
					leftToAllocate2 -= pane.size;
				});
				if (leftToAllocate2 > 0.1) {
					readjustSizes(leftToAllocate, ungrowable, unshrinkable);
				}
			}
		}

		/** 加或移除pane后，所有pane的总尺寸接近或等于100% */
		function equalizeAfterAddOrRemove({ addedPane }: ChangedPaneType = {}) {
			let equalSpace = 100 / panesCount.value;
			let leftToAllocate = 0;
			const ungrowable: number[] = [];
			const unshrinkable: number[] = [];

			if (addedPane && addedPane.givenSize !== null) {
				equalSpace = (100 - addedPane.givenSize) / (panesCount.value - 1);
			}
			panes.value.forEach((pane) => {
				leftToAllocate -= pane.size;
				if (pane.size >= pane.max) ungrowable.push(pane.id);
				if (pane.size <= pane.min) unshrinkable.push(pane.id);
			});
			if (Math.abs(leftToAllocate) < 0.1) return; // Ok.
			panes.value.forEach((pane) => {
				if (
					addedPane &&
					addedPane.givenSize !== null &&
					addedPane.id === pane.id
				) {
					//
				} else pane.size = Math.max(Math.min(equalSpace, pane.max), pane.min);

				leftToAllocate -= pane.size;
				if (pane.size >= pane.max) ungrowable.push(pane.id);
				if (pane.size <= pane.min) unshrinkable.push(pane.id);
			});
			if (leftToAllocate > 0.1)
				readjustSizes(leftToAllocate, ungrowable, unshrinkable);
		}

		/** 第二次循环来调整大小 */
		function readjustSizes(
			leftToAllocate: number,
			ungrowable: number[],
			unshrinkable: number[]
		) {
			let equalSpaceToAllocate;

			if (leftToAllocate > 0) {
				// 如果leftToAllocate大于0（即有剩余空间需要分配），则计算每个面板平均可以分配的空间equalSpaceToAllocate。这里排除那些已经达到最大尺寸（即不可增长）的面板。
				equalSpaceToAllocate =
					leftToAllocate / (panesCount.value - ungrowable.length);
			} else {
				// 如果leftToAllocate小于0（即需要减少一些面板的尺寸），则计算每个面板平均需要减少的空间。这里排除那些已经达到最小尺寸（即不可缩小）的面板。
				equalSpaceToAllocate =
					leftToAllocate / (panesCount.value - unshrinkable.length);
			}

			panes.value.forEach((pane) => {
				if (leftToAllocate > 0 && !ungrowable.includes(pane.id)) {
					// 如果还有剩余空间（leftToAllocate > 0）且面板不在ungrowable数组中（即该面板还可以增长），则增加其尺寸。
					const newPaneSize = Math.max(
						Math.min(pane.size + equalSpaceToAllocate, pane.max),
						pane.min
					);
					const allocated = newPaneSize - pane.size;
					leftToAllocate -= allocated;
					pane.size = newPaneSize;
				} else if (!unshrinkable.includes(pane.id)) {
					// 如果需要减少面板尺寸，并且面板不在unshrinkable数组中（即该面板还可以缩小），则减少其尺寸。
					const newPaneSize = Math.max(
						Math.min(pane.size + equalSpaceToAllocate, pane.max),
						pane.min
					);
					const allocated = newPaneSize - pane.size;
					leftToAllocate -= allocated;
					pane.size = newPaneSize;
				}
				pane.update({
					[props.horizontal ? 'height' : 'width']: `${
						indexedPanes.value[pane.id].size
					}%`,
				});
			});
			if (Math.abs(leftToAllocate) > 0.1) {
				nextTick(() => {
					if (ready.value) {
						// eslint-disable-next-line no-console
						console.warn(
							'Splitpanes: Could not resize panes correctly due to their constraints.'
						);
					}
				});
			}
		}

		watch(
			() => props.horizontal,
			() => {
				updatePaneComponents();
			}
		);

		watch(
			() => panes.value,
			() => {
				updatePaneComponents();
			},
			{
				deep: true,
				immediate: false,
			}
		);

		watch(
			() => props.firstSplitter,
			() => {
				redoSplitters();
			}
		);
		watch(
			() => props.dblClickSplitter,
			(enable) => {
				if (container.value) {
					const splitters = [
						...container.value.querySelectorAll('.splitpanes__splitter'),
					];
					splitters.forEach((splitter: any, i) => {
						splitter.ondblclick = enable
							? (event: any) => onSplitterDblClick(event, i)
							: undefined;
					});
				}
			}
		);

		onBeforeUnmount(() => {
			ready.value = false;
		});

		onMounted(() => {
			checkSplitpanesNodes();
			redoSplitters();
			resetPaneSizes();
			emit('ready');
			ready.value = true;
		});

		return () => (
			<div
				ref={container}
				class={[
					'splitpanes',
					`splitpanes--${props.horizontal ? 'horizontal' : 'vertical'}`,
					{
						'splitpanes--dragging': touch.dragging,
					},
				]}
			>
				{slots.default?.()}
			</div>
		);
	},
});
</script>
