import {
	createSimpleTransition,
	createJavascriptTransition,
} from './src/create-transition';

import ExpandTransitionGenerator from './src/ExpandTransition';

export { default as LTTransition } from './src/lt-transition.vue';

export const LTFadeTransition = createSimpleTransition('fade-transition');
export const LTScaleTransition = createSimpleTransition('scale-transition');
export const LTSlideYTransition = createSimpleTransition('slide-y-transition');
export const LTScrollYTransition = createSimpleTransition(
	'scroll-y-transition'
);
export const LTSlideYReverseTransition = createSimpleTransition(
	'slide-y-reverse-transition'
);
export const LTScrollYReverseTransition = createSimpleTransition(
	'scroll-y-reverse-transition'
);
export const LTSlideXTransition = createSimpleTransition('slide-x-transition');
export const LTScrollXTransition = createSimpleTransition(
	'scroll-x-transition'
);
export const LTSlideXReverseTransition = createSimpleTransition(
	'slide-x-reverse-transition'
);
export const LTScrollXReverseTransition = createSimpleTransition(
	'scroll-x-reverse-transition'
);
export const LTScaleRotateTransition = createSimpleTransition(
	'scale-rotate-transition'
);

export const LTExpandXTransition = createJavascriptTransition(
	'expand-x-transition',
	ExpandTransitionGenerator('', true)
);

export const LTExpandTransition = createJavascriptTransition(
	'expand-transition',
	ExpandTransitionGenerator('')
);
