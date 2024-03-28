import { withInstall } from '@lt-frame/utils';
import grid from './src/grid.vue';

export const LTGrid: typeof grid = withInstall(grid);

export * from './src/grid';
export * from './render';
