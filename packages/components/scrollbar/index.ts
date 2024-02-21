import { withInstall } from '@lt-frame/utils';

import Scrollbar from './src/scrollbar.vue';

export const LTScrollbar = withInstall(Scrollbar);
export default LTScrollbar;

export * from './src/util';
export * from './src/scrollbar';
export * from './src/thumb';
export * from './src/constants';
