import {
	createSimpleTransition,
	createJavascriptTransition,
} from './src/create-transition';

import ExpandTransitionGenerator from './src/ExpandTransition';

export { default as LtTransition } from './src/lt-transition.vue';

export const LtFadeTransition = createSimpleTransition('fade-transition');
export const LtScaleTransition = createSimpleTransition('scale-transition');
export const LtSlideYTransition = createSimpleTransition('slide-y-transition');
export const LtScrollYTransition = createSimpleTransition(
	'scroll-y-transition'
);
export const LtSlideYReverseTransition = createSimpleTransition(
	'slide-y-reverse-transition'
);
export const LtScrollYReverseTransition = createSimpleTransition(
	'scroll-y-reverse-transition'
);
export const LtSlideXTransition = createSimpleTransition('slide-x-transition');
export const LtScrollXTransition = createSimpleTransition(
	'scroll-x-transition'
);
export const LtSlideXReverseTransition = createSimpleTransition(
	'slide-x-reverse-transition'
);
export const LtScrollXReverseTransition = createSimpleTransition(
	'scroll-x-reverse-transition'
);
export const LtScaleRotateTransition = createSimpleTransition(
	'scale-rotate-transition'
);

export const LtExpandXTransition = createJavascriptTransition(
	'expand-x-transition',
	ExpandTransitionGenerator('', true)
);

export const LtExpandTransition = createJavascriptTransition(
	'expand-transition',
	ExpandTransitionGenerator('')
);
