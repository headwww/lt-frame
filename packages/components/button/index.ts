import { withInstall } from '@lt-frame/utils';
import Button from './src/button.vue';
import PopConfirmButton from './src/pop-confirm-button.vue';

export const LtButton = withInstall(Button);
export const LtPopConfirmButton = withInstall(PopConfirmButton);

export * from './src/button';
export * from './src/pop-confirm-button';
