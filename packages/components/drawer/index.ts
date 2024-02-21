import { withInstall } from '@lt-frame/utils';
import drawer from './src/drawer.vue';

export const LTDrawer: typeof drawer = withInstall(drawer);
export default LTDrawer;

export * from './src/drawer';
export * from './src/drawer-footer';
export * from './src/drawer-header';
