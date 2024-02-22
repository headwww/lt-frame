<template>
	<div :class="getClass" ref="wrapperRef">
		<PageHeader
			:ghost="ghost"
			:title="title"
			v-bind="omit($attrs, 'class')"
			ref="headerRef"
			v-if="getShowHeader"
		>
			<template #default>
				<template v-if="content">
					{{ content }}
				</template>
				<slot name="headerContent" v-else></slot>
			</template>
			<template #[item]="data" v-for="item in getHeaderSlots">
				<slot :name="item" v-bind="data || {}"></slot>
			</template>
		</PageHeader>

		<div
			style="overflow: hidden"
			:class="getContentClass"
			:style="getContentStyle"
			ref="contentRef"
		>
			<slot></slot>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { useAttrs, useContentHeight, useNamespace } from '@lt-frame/hooks';
import { PageHeader } from 'ant-design-vue';
import { omit } from 'lodash-es';
import { CSSProperties, computed, ref, unref, useSlots } from 'vue';
import { pageLayoutProps } from './page-layout';

defineOptions({
	name: 'LTPageLayout',
	inheritAttrs: false,
});

const ns = useNamespace('page-layout');

const props = defineProps(pageLayoutProps);

const slots = useSlots();
const attrs = useAttrs();

const wrapperRef = ref(null);
const headerRef = ref(null);
const contentRef = ref(null);

const getIsContentFullHeight = computed(() => props.contentFullHeight);

const getUpwardSpace = computed(() => props.upwardSpace);

const { contentHeight } = useContentHeight(
	getIsContentFullHeight,
	wrapperRef,
	[headerRef],
	[contentRef],
	getUpwardSpace
);

const getClass = computed(() => [
	ns.b(),
	{
		[`${ns.m('dense')}`]: props.dense,
	},
	attrs.class ?? {},
]);

const getShowHeader = computed(
	() =>
		props.content ||
		slots?.headerContent ||
		props.title ||
		getHeaderSlots.value.length
);

type PageHeaderSlotNames =
	| 'backIcon'
	| 'avatar'
	| 'breadcrumb'
	| 'title'
	| 'subTitle'
	| 'tags'
	| 'extra'
	| 'footer'
	| 'default';

const getHeaderSlots = computed(
	() =>
		Object.keys(
			omit(slots, 'default', 'headerContent')
		) as PageHeaderSlotNames[]
);

const getContentStyle = computed((): CSSProperties => {
	const { contentFullHeight, contentStyle, fixedHeight } = props;
	if (!contentFullHeight) {
		return { ...contentStyle };
	}

	const height = `${unref(contentHeight)}px`;

	return {
		...contentStyle,
		minHeight: height,
		...(fixedHeight ? { height } : {}),
	};
});

const getContentClass = computed(() => {
	const { contentClass } = props;
	return [
		ns.b('content'),
		contentClass,
		{
			[`${ns.b('content-bg')}`]: true,
		},
	];
});
</script>
