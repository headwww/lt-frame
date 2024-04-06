import { withInstall } from '@lt-frame/utils';
import arrow from './src/arrow.vue';
import help from './src/help.vue';
import divider from './src/divider.vue';

export const LTArrow = withInstall(arrow);
export const LTHelp = withInstall(help);
export const LTDivider = withInstall(divider);

export * from './src/arrow';
export * from './src/help';
export * from './src/divider';
