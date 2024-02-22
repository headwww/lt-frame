import { ExtractPropTypes } from 'vue';
import recycleScrollerVue from './recycle-scroller.vue';

export const recycleScrollerProps = {
	keyField: {
		type: String,
		default: 'id',
	},

	items: {
		type: Array<any>,
		required: true,
		default: [],
	},
	itemSize: {
		type: Number,
		default: null,
	},
	listTag: {
		type: String,
		default: 'div',
	},
	itemTag: {
		type: String,
		default: 'div',
	},
	prerender: {
		type: Number,
		default: 0,
	},

	direction: {
		type: String,
		default: 'vertical',
		validator: (value: string) => ['vertical', 'horizontal'].includes(value),
	},
	buffer: {
		type: Number,
		default: 200,
	},
	disableTransform: {
		type: Boolean,
		default: false,
	},
	typeField: {
		type: String,
		default: 'type',
	},
	emitUpdate: {
		type: Boolean,
		default: false,
	},

	listClass: {
		type: [String, Object, Array],
		default: '',
	},
	itemClass: {
		type: [String, Object, Array],
		default: '',
	},
	gridItems: {
		type: Number,
		default: undefined,
	},

	itemSecondarySize: {
		type: Number,
		default: undefined,
	},

	minItemSize: {
		type: [Number, String],
		default: null,
	},

	updateInterval: {
		type: Number,
		default: 0,
	},

	skipHover: {
		type: Boolean,
		default: false,
	},

	sizeField: {
		type: String,
		default: 'size',
	},
};

export const dynamicScrollerProps = {
	items: {
		type: Array,
		required: true,
	},

	keyField: {
		type: String,
		default: 'id',
	},

	direction: {
		type: String,
		default: 'vertical',
		validator: (value: string) => ['vertical', 'horizontal'].includes(value),
	},

	listTag: {
		type: String,
		default: 'div',
	},

	itemTag: {
		type: String,
		default: 'div',
	},
	minItemSize: {
		type: [Number, String],
		required: true,
	},
};

export type RecycleScrollerProps = ExtractPropTypes<
	typeof recycleScrollerProps
>;

export type RecycleScrollerInstance = InstanceType<typeof recycleScrollerVue>;
