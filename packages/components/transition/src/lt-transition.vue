<template>
	<transition mode="out-in" v-on="on">
		<slot></slot>
	</transition>
</template>
<script lang="ts">
import { addClass, removeClass } from '@lt-frame/utils';
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'LtTransition',
	setup() {
		return {
			on: {
				beforeEnter(el: any) {
					addClass(el, 'lt-transition');
					if (!el.dataset) el.dataset = {};

					el.dataset.oldPaddingTop = el.style.paddingTop;
					el.dataset.oldPaddingBottom = el.style.paddingBottom;

					el.style.height = '0';
					el.style.paddingTop = 0;
					el.style.paddingBottom = 0;
				},

				enter(el: any) {
					el.dataset.oldOverflow = el.style.overflow;
					if (el.scrollHeight !== 0) {
						el.style.height = `${el.scrollHeight}px`;
						el.style.paddingTop = el.dataset.oldPaddingTop;
						el.style.paddingBottom = el.dataset.oldPaddingBottom;
					} else {
						el.style.height = '';
						el.style.paddingTop = el.dataset.oldPaddingTop;
						el.style.paddingBottom = el.dataset.oldPaddingBottom;
					}

					el.style.overflow = 'hidden';
				},

				afterEnter(el: any) {
					removeClass(el, 'lt-transition');
					el.style.height = '';
					el.style.overflow = el.dataset.oldOverflow;
				},

				beforeLeave(el: any) {
					if (!el.dataset) el.dataset = {};
					el.dataset.oldPaddingTop = el.style.paddingTop;
					el.dataset.oldPaddingBottom = el.style.paddingBottom;
					el.dataset.oldOverflow = el.style.overflow;

					el.style.height = `${el.scrollHeight}px`;
					el.style.overflow = 'hidden';
				},

				leave(el: any) {
					if (el.scrollHeight !== 0) {
						addClass(el, 'lt-transition');
						el.style.height = 0;
						el.style.paddingTop = 0;
						el.style.paddingBottom = 0;
					}
				},

				afterLeave(el: any) {
					removeClass(el, 'lt-transition');
					el.style.height = '';
					el.style.overflow = el.dataset.oldOverflow;
					el.style.paddingTop = el.dataset.oldPaddingTop;
					el.style.paddingBottom = el.dataset.oldPaddingBottom;
				},
			},
		};
	},
});
</script>
