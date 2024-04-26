import { withInstall } from '@lt-frame/utils';
import Splitpanes from './src/splitpanes.vue';
import Pane from './src/pane.vue';

export const LtSplitpanes = withInstall(Splitpanes);
export const LtPane = withInstall(Pane);
export * from './src/pane';
export * from './src/splitpanes';
