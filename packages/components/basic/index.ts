import { withInstall } from '@lt-frame/utils';
import arrow from './src/arrow.vue';
import help from './src/help.vue';
import divider from './src/divider.vue';
import title from './src/title.vue';

export const LtArrow = withInstall(arrow);
export const LtHelp = withInstall(help);
export const LtDivider = withInstall(divider);
export const LtTitle = withInstall(title);

export * from './src/arrow';
export * from './src/help';
export * from './src/divider';
