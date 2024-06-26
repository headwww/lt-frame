import {
	computed,
	defineComponent,
	h,
	reactive,
	ref,
	toRefs,
	unref,
} from 'vue';
import { UseDraggableOptions, useDraggable } from './useDraggable';
import { objectMap } from './util';

interface IProps extends UseDraggableOptions<any> {
	modelValue?: any[];
	tag?: string;
	target?: string;
}
// Need to declare Event thrown here, otherwise it will cause Sortablejs internal dispatch Event, repeated trigger events
const emits = [
	'update',
	'start',
	'add',
	'remove',
	'choose',
	'unchoose',
	'end',
	'sort',
	'filter',
	'clone',
	'move',
	'change',
] as const;

const props = [
	'clone',
	'animation',
	'ghostClass',
	'group',
	'sort',
	'disabled',
	'store',
	'handle',
	'draggable',
	'swapThreshold',
	'invertSwap',
	'invertedSwapThreshold',
	'removeCloneOnHide',
	'direction',
	'chosenClass',
	'dragClass',
	'ignore',
	'filter',
	'preventOnFilter',
	'easing',
	'setData',
	'dropBubble',
	'dragoverBubble',
	'dataIdAttr',
	'delay',
	'delayOnTouchOnly',
	'touchStartThreshold',
	'forceFallback',
	'fallbackClass',
	'fallbackOnBody',
	'fallbackTolerance',
	'fallbackOffset',
	'supportPointer',
	'emptyInsertThreshold',
	'scroll',
	'forceAutoScrollFallback',
	'scrollSensitivity',
	'scrollSpeed',
	'bubbleScroll',
	'modelValue',
	'tag',
	'target',
	'customUpdate',
	...emits.map((key) => `on${key.replace(/^\S/, (s) => s.toUpperCase())}`),
] as const;

export const LtDraggable = defineComponent<IProps>({
	name: 'LtDraggable',
	model: {
		prop: 'modelValue',
		event: 'update:modelValue',
	},
	props: props as unknown as any,
	emits: ['update:modelValue', ...emits],
	setup(props, { slots, emit, expose, attrs }) {
		const events = emits.reduce((acc, key) => {
			const event = `on${key.replace(/^\S/, (s) => s.toUpperCase())}`;
			acc[event] = (e: any) => emit(key, e);
			return acc;
		}, {} as any);

		const options = computed(() => {
			// eslint-disable-next-line
			const { modelValue, ...rest } = toRefs(props);
			const opt = Object.entries(rest).reduce((acc, [key, value]) => {
				// @ts-ignore
				const newValue = unref(value);
				if (newValue !== undefined) acc[key] = newValue;
				return acc;
			}, {} as any);
			return {
				...events,
				...objectMap({ ...attrs, ...opt }),
			};
		});

		const list = computed({
			get: () => props.modelValue,
			set: (v) => emit('update:modelValue', v),
		});

		const target = ref();
		const data = reactive(
			useDraggable((props.target || target) as string, list, options)
		);

		expose(data);

		return () => h(props.tag || 'div', { ref: target }, slots?.default?.(data));
	},
});
