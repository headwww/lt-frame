<template>
	<div
		ref="recycleRef"
		:class="{ [`${ns.b()}`]: true, ready, [`direction-${direction}`]: true }"
		@scroll.passive="handleScroll"
	>
		<div v-if="$slots.before" ref="beforeRef" class="lt-recycle-scroller__slot">
			<slot name="before"></slot>
		</div>
		<component
			:is="listTag"
			ref="wrapper"
			:style="{
				[direction === 'vertical' ? 'minHeight' : 'minWidth']: totalSize + 'px',
			}"
			class="lt-recycle-scroller__item-wrapper"
			:class="listClass"
		>
			<ItemView
				v-for="view of pool"
				:key="view.nr.id"
				:view="view"
				:item-tag="itemTag"
				class="lt-recycle-scroller__item-view"
				:style="
					ready
						? [
								disableTransform
									? {
											[direction === 'vertical' ? 'top' : 'left']:
												`${view.position}px`,
											willChange: 'unset',
										}
									: {
											transform: `translate${
												direction === 'vertical' ? 'Y' : 'X'
											}(${view.position}px) translate${
												direction === 'vertical' ? 'X' : 'Y'
											}(${view.offset}px)`,
										},
								{
									width: gridItems
										? `${
												direction === 'vertical'
													? itemSecondarySize || itemSize
													: itemSize
											}px`
										: undefined,
									height: gridItems
										? `${
												direction === 'horizontal'
													? itemSecondarySize || itemSize
													: itemSize
											}px`
										: undefined,
								},
							]
						: null
				"
				:class="[
					itemClass,
					{
						hover: !skipHover && hoverKey === view.nr.key,
					},
				]"
				v-on="
					skipHover
						? {}
						: {
								mouseenter: () => {
									hoverKey = view.nr.key;
								},
								mouseleave: () => {
									hoverKey = null;
								},
							}
				"
			>
				<template #default="props">
					<slot v-bind="props"></slot>
				</template>
			</ItemView>
			<slot name="empty"></slot>
		</component>
		<div v-if="$slots.after" ref="afterRef" class="lt-recycle-scroller__slot">
			<slot name="after"></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	computed,
	markRaw,
	nextTick,
	onActivated,
	onBeforeUnmount,
	onMounted,
	ref,
	shallowReactive,
	unref,
	watch,
} from 'vue';
import { useIntersectionObserver, useResizeObserver } from '@vueuse/core';
import { useNamespace } from '@lt-frame/hooks';
import ItemView from './item-view.vue';
import { recycleScrollerProps } from './recycle-scroller';

const ns = useNamespace('recycle-scroller');

defineOptions({
	name: 'LTRecycleScroller',
});

const props = defineProps(recycleScrollerProps);

const emit = defineEmits([
	'resize',
	'visible',
	'hidden',
	'update',
	'scroll-start',
	'scroll-end',
]);

// created
// item的id
let uid = 0;
// 记录刷新完成的开始索引
let prevStartIndex = 0;
// 记录刷新完成的结束索引
let prevEndIndex = 0;
// 记录上一次滚到了哪里start值
let lastUpdateScrollPosition = 0;
// 存储页面上所有展示过的视图
const $_views = new Map();
// 回收视图池
const $_recycledPools = new Map();
// 组件是否完成其初始渲染
const ready = ref(false);
// items的总高度, totalSize会给到外层盒子的高度，为了制造出滚动条
const totalSize = ref(0);
// 当前页面显示得视图池，存储当前页面要渲染得数据，即pool是tempalte中渲染真实使用到的。
const pool = ref<Array<any>>([]);
// 排序定时器
let sortTimer;
let $_prerender = false;
let $_computedMinItemSize;

// 我们需要悬停项的键来防止ItemView被回收以保持悬停状态。
const hoverKey = ref();
const recycleRef = ref<HTMLDivElement>();
const beforeRef = ref<HTMLDivElement>();
const afterRef = ref<HTMLDivElement>();
const wrapper = ref<HTMLDivElement>();

if (props.prerender) {
	$_prerender = true;
	updateVisibleItems(false);
}

if (props.gridItems && !props.itemSize) {
	// eslint-disable-next-line no-console
	console.error(
		'[lt-recycle-scroller] You must provide an itemSize when using gridItems'
	);
}

// 对于可变高度，计算属性会优先维护一个sizes表，已记录对应索引的size累计值。
// 此操作目的是为了后续根据索引即可拿到size之和，而不必每次都重新计算。
const sizes = computed(() => {
	if (props.itemSize === null) {
		const sizes = {
			'-1': { accumulator: 0 },
		};

		const { items, sizeField, minItemSize } = props;
		let computedMinSize = 10000;
		let accumulator: number = 0;
		let current: number;
		for (let i = 0, l = items.length; i < l; i += 1) {
			current = items[i][sizeField] || minItemSize;
			if (current < computedMinSize) {
				computedMinSize = current;
			}
			accumulator += current;
			sizes[i] = { accumulator, size: current };
		}
		$_computedMinItemSize = computedMinSize;
		return sizes;
	}
	return [];
});

const simpleArray = computed(() => {
	const { items } = props;
	return items.length && typeof items[0] !== 'object';
});

const { stop: stopIntersectionObserver } = useIntersectionObserver(
	recycleRef,
	([{ isIntersecting }]) => {
		if (ready.value) {
			const el = unref(recycleRef);
			if (
				isIntersecting ||
				el?.getBoundingClientRect().width !== 0 ||
				el.getBoundingClientRect().height !== 0
			) {
				emit('visible');
				requestAnimationFrame(() => {
					updateVisibleItems(false);
				});
			} else {
				emit('hidden');
			}
		}
	}
);

const { stop: stopResizeObserver } = useResizeObserver(recycleRef, () =>
	handleResize()
);

watch(
	() => props.items,
	() => updateVisibleItems(true)
);
watch(
	() => sizes.value,
	() => {
		updateVisibleItems(false);
	},
	{
		deep: true,
	}
);
watch(
	() => props.gridItems,
	() => updateVisibleItems(true)
);
watch(
	() => props.itemSecondarySize,
	() => updateVisibleItems(true)
);
onMounted(() => {
	nextTick(() => {
		$_prerender = false;
		updateVisibleItems(true);
		ready.value = true;
	});
});

onActivated(() => {
	const lastPosition = lastUpdateScrollPosition;
	if (typeof lastPosition === 'number') {
		nextTick(() => {
			scrollToPosition(lastPosition);
		});
	}
});

onBeforeUnmount(() => {
	stopIntersectionObserver?.();
	stopResizeObserver?.();
});

/**
 * 视图刷新函数
 */
function updateVisibleItems(
	itemsChanged: Boolean,
	checkPositionDiff: Boolean = false
) {
	const {
		itemSize,
		items,
		buffer,
		typeField,
		keyField,
		gridItems,
		itemSecondarySize,
		updateInterval,
	} = props;
	const key_Field = simpleArray.value ? null : keyField;
	const grid_items = gridItems || 1;
	const item_secondary_size = itemSecondarySize || itemSize;
	const minItemSize = $_computedMinItemSize;
	const views = $_views;
	const count = items.length;
	let startIndex;
	let endIndex;
	let realSize;
	let visibleStartIndex;
	let visibleEndIndex;

	if (!count) {
		// 无数据
		startIndex = 0;
		endIndex = 0;
		realSize = 0;
		visibleStartIndex = 0;
		visibleEndIndex = 0;
	} else if ($_prerender) {
		startIndex = 0;
		visibleStartIndex = 0;
		endIndex = Math.min(props.prerender, items.length);
		visibleEndIndex = Math.min(props.prerender, items.length);
		realSize = null;
	} else {
		const scroll = getScroll();
		//  处判断当前滚动的范围未超出设置的itemSize，
		// 即没有超过一个view，此时pool不需要改变，则此次不进行update操作
		if (checkPositionDiff) {
			let positionDiff = scroll.start - lastUpdateScrollPosition;
			if (positionDiff < 0) positionDiff = -positionDiff;
			if (
				(itemSize === null && positionDiff < minItemSize) ||
				positionDiff < itemSize
			) {
				return {
					continuous: true,
				};
			}
		}
		// 刷新此次滚动后的位置信息
		lastUpdateScrollPosition = scroll.start;

		// 计算缓冲量(在起始位置减去，在结束位置加上、解决卡白屏的问题)，默认为200px
		scroll.start -= buffer;
		scroll.end += buffer;

		// 将before、after的距离考虑在内
		const before = unref(beforeRef);
		let beforeSize = 0;
		if (before) {
			beforeSize = before.scrollHeight;
			scroll.start -= beforeSize;
		}
		const after = unref(afterRef);
		if (after) {
			scroll.end += after.scrollHeight;
		}

		if (itemSize === null) {
			// 每个item的高度不固定 二分查找
			// 因为每个item的高度不固定，无法直接用scroll.start得到startIndex。所以通过二分法快速查找到第一个出现在可视区的视图，即startIndex。
			// 由于计算属性已缓存了可变高度的所有size记录，二分法查找的目的等价于查找到sizes中的索引，
			// 该索引满足index项的accumulator小于scroll.start，index+1项的accumulator大于scroll.start，则为刚滑到可视区的startIndex
			let h;
			let a = 0;
			let b = count - 1;
			let i = ~~(count / 2);
			let oldI;

			// Searching for startIndex
			do {
				oldI = i;
				h = sizes.value[i].accumulator;
				if (h < scroll.start) {
					a = i;
				} else if (
					i < count - 1 &&
					sizes.value[i + 1].accumulator > scroll.start
				) {
					b = i;
				}
				i = ~~((a + b) / 2);
			} while (i !== oldI);
			i < 0 && (i = 0);
			startIndex = i;

			realSize = sizes.value[count - 1].accumulator;

			for (
				endIndex = i;
				endIndex < count && sizes.value[endIndex].accumulator < scroll.end;
				endIndex += 1
			);
			if (endIndex === -1) {
				endIndex = items.length - 1;
			} else {
				endIndex += 1;
				endIndex > count && (endIndex = count);
			}

			for (
				visibleStartIndex = startIndex;
				visibleStartIndex < count &&
				beforeSize + sizes.value[visibleStartIndex].accumulator < scroll.start;
				visibleStartIndex += 1
			);

			for (
				visibleEndIndex = visibleStartIndex;
				visibleEndIndex < count &&
				beforeSize + sizes.value[visibleEndIndex].accumulator < scroll.end;
				visibleEndIndex += 1
			);
		} else {
			// 固定高度 计算需要生成的view的startIndex和endIndex索引
			startIndex = ~~((scroll.start / itemSize) * grid_items);
			const remainer = startIndex % grid_items;
			startIndex -= remainer;
			endIndex = Math.ceil((scroll.end / itemSize) * grid_items);
			visibleStartIndex = Math.max(
				0,
				Math.floor(((scroll.start - beforeSize) / itemSize) * grid_items)
			);
			visibleEndIndex = Math.floor(
				((scroll.end - beforeSize) / itemSize) * grid_items
			);

			// 防止由于计算错误或其他原因导致的索引越界问题。
			startIndex < 0 && (startIndex = 0);
			endIndex > count && (endIndex = count);
			visibleStartIndex < 0 && (visibleStartIndex = 0);
			visibleEndIndex > count && (visibleEndIndex = count);

			realSize = Math.ceil(count / grid_items) * itemSize;
		}
	}

	// 处理渲染的项目数超过预定限制的情况
	const itemsLimit = 1000;
	if (endIndex - startIndex > itemsLimit) {
		throw new Error('已经达到了可渲染项目的上限。');
	}

	totalSize.value = realSize;

	let view;
	const continuous = startIndex <= prevEndIndex && endIndex >= prevStartIndex;
	if (!continuous || itemsChanged) {
		// 直接拖动滚动条，不是滚动鼠标则不是连续滑动，则页面出现了大的改变，初始化数据
		removeAndRecycleAllViews();
	} else {
		for (let i = 0, l = pool.value.length; i < l; i += 1) {
			view = pool.value[i];
			if (view.nr.used) {
				const viewVisible =
					view.nr.index >= startIndex && view.nr.index < endIndex;
				const viewSize = itemSize || sizes.value[i].size;
				// 检查视图是否在当前页面的可见范围内，如果视图不在可见范围内或者大小不存在，
				// 调用removeAndRecycleView函数将该视图从页面上移除并放入回收池，以便后续重用。
				if (!viewVisible || !viewSize) {
					removeAndRecycleView(view);
				}
			}
		}
	}

	// 负责管理可见项目的视图，确保它们的位置正确，并在需要时创建或重用视图。
	let item;
	let type;
	for (let i = startIndex; i < endIndex; i += 1) {
		const elementSize = itemSize || sizes.value[i].size;
		// eslint-disable-next-line no-continue
		if (!elementSize) continue;
		item = items[i];
		const key = key_Field ? item[key_Field] : i;
		if (key == null) {
			throw new Error(`Key is ${key} on item (keyField is '${key_Field}')`);
		}
		view = views.get(key);
		if (!view) {
			// 重用视图
			type = item[typeField];
			view = getRecycledView(type);
			if (view) {
				view.item = item;
				view.nr.index = i;
				view.nr.key = key;
				if (view.nr.type !== type) {
					// eslint-disable-next-line no-console
					console.warn("Reused view's type does not match pool's type");
				}
			} else {
				// 没有可用的回收视图，创建一个新视图
				view = createView(i, item, key, type);
			}
			views.set(key, view);
		} else {
			if (view.item !== item) {
				view.item = item;
			}
			if (!view.nr.used) {
				// eslint-disable-next-line no-console
				console.warn(
					`Expected existing view's used flag to be true, got ${view.nr.used}`
				);
			}
		}

		if (itemSize === null) {
			view.position = sizes.value[i - 1].accumulator;
			view.offset = 0;
		} else {
			view.position = Math.floor(i / grid_items) * itemSize;
			view.offset = (i % grid_items) * item_secondary_size;
		}
	}

	prevStartIndex = startIndex;
	prevEndIndex = endIndex;

	if (props.emitUpdate)
		emit('update', startIndex, endIndex, visibleStartIndex, visibleEndIndex);
	// 负责在一定时间间隔后对视图进行排序，以确保正确的文本选择。
	clearTimeout(sortTimer);
	sortTimer = setTimeout(() => {
		pool.value.sort((viewA, viewB) => viewA.nr.index - viewB.nr.index);
	}, updateInterval + 300);

	return [continuous];
}

function createView(index: Number, item: any, key: any, type: any) {
	const nr = markRaw({
		id: (uid += 1),
		index,
		used: true,
		key,
		type,
	});
	const view = shallowReactive({
		item,
		position: 0,
		nr,
	});
	pool.value.push(view);
	return view;
}

function getRecycledPool(type) {
	const recycledPools = $_recycledPools;
	let recycledPool = recycledPools.get(type);
	if (!recycledPool) {
		recycledPool = [];
		recycledPools.set(type, recycledPool);
	}
	return recycledPool;
}

function getRecycledView(type) {
	const recycledPool = getRecycledPool(type);
	if (recycledPool && recycledPool.length) {
		const view = recycledPool.pop();
		view.nr.used = true;
		return view;
	}
	return null;
}

function removeAndRecycleView(view) {
	const { type } = view.nr;
	const recycledPool = getRecycledPool(type);
	recycledPool.push(view);
	view.nr.used = false;
	view.position = -9999;
	$_views.delete(view.nr.key);
}

function removeAndRecycleAllViews() {
	$_views.clear();
	$_recycledPools.clear();
	for (let i = 0, l = pool.value.length; i < l; i += 1) {
		removeAndRecycleView(pool.value[i]);
	}
}

function getScroll() {
	const el = unref(recycleRef) as HTMLDivElement;
	const isVertical = props.direction;
	let scrollState;
	// 计算可是区域起始位置
	if (isVertical) {
		scrollState = {
			start: el.scrollTop,
			end: el.scrollTop + el.clientHeight,
		};
	} else {
		scrollState = {
			start: el.scrollLeft,
			end: el.scrollLeft + el.clientWidth,
		};
	}
	return scrollState;
}

// 标记是否正在滚动，用于滚动节流
let $_scrollDirty = false;
let $_updateTimeout;
let $_refreshTimout;
function handleScroll() {
	if (!$_scrollDirty) {
		$_scrollDirty = true;
		if ($_updateTimeout) return;

		const requestUpdate = () =>
			requestAnimationFrame(() => {
				$_scrollDirty = false;
				const { continuous } = updateVisibleItems(false, true) as any;

				// It seems sometimes chrome doesn't fire scroll event :/
				// When non continous scrolling is ending, we force a refresh
				if (!continuous) {
					clearTimeout($_refreshTimout);
					$_refreshTimout = setTimeout(
						handleScroll,
						props.updateInterval + 100
					);
				}
			});

		requestUpdate();

		// Schedule the next update with throttling
		if (props.updateInterval) {
			$_updateTimeout = setTimeout(() => {
				$_updateTimeout = 0;
				if ($_scrollDirty) requestUpdate();
			}, props.updateInterval);
		}
	}
}

function handleResize() {
	emit('resize');
	if (ready.value) updateVisibleItems(false);
}

function scrollToItem(index: number) {
	let scroll;
	const gridItems = props.gridItems || 1;
	if (props.itemSize === null) {
		scroll = index > 0 ? sizes.value[index - 1].accumulator : 0;
	} else {
		scroll = Math.floor(index / gridItems) * props.itemSize;
	}
	scrollToPosition(scroll);
}

function scrollToPosition(position: number) {
	const direction =
		props.direction === 'vertical'
			? { scroll: 'scrollTop', start: 'top' }
			: { scroll: 'scrollLeft', start: 'left' };

	const viewport = unref(recycleRef);
	const scrollDirection = direction.scroll;
	const scrollDistance = position;

	viewport!![scrollDirection] = scrollDistance;
}

defineExpose({
	scrollToItem,
	scrollToPosition,
	getScroll,
});
</script>
