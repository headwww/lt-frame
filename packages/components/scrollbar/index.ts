import { withInstall } from '@lt-frame/utils';

import Scrollbar from './src/scrollbar.vue';

export const LtScrollbar = withInstall(Scrollbar);
export default LtScrollbar;

export * from './src/util';
export * from './src/scrollbar';
export * from './src/thumb';
export * from './src/constants';
