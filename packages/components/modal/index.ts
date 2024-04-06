import { withInstall } from '@lt-frame/utils';
import modal from './src/modal.vue';

export const LtModal: typeof modal = withInstall(modal);

export * from './src/typing';
export * from './src/components/base-modal';
export * from './src/components/modal-close';
export * from './src/components/modal-footer';
export * from './src/components/modal-wrapper';

export { useModal, useModalInner } from './src/hooks/useModal';
