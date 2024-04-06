import { withInstall } from '@lt-frame/utils';
import recycleScroller from './src/recycle-scroller.vue';
import itemView from './src/item-view.vue';

export const LtRecycleScroller = withInstall(recycleScroller);
export const LtItemView = withInstall(itemView);

export * from './src/recycle-scroller';
export * from './src/item-view';
