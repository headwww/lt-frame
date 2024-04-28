import { withInstall } from '@lt-frame/utils';
import drawer from './src/drawer.vue';

export const LtDrawer: typeof drawer = withInstall(drawer);
export default LtDrawer;

export * from './src/drawer';
export * from './src/drawer-footer';
export * from './src/drawer-header';
export * from './src/use-drawer';
