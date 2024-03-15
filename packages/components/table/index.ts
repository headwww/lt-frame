import { withInstall } from '@lt-frame/utils';
import table from './src/table.vue';

export const LTTable = withInstall(table);

export * from './render';
export * from './src/table';
