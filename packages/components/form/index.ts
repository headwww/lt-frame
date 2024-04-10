import { withInstall } from '@lt-frame/utils';
import form from './src/form.vue';
import formItem from './src/form-item.vue';
import formGather from './src/form-gather.vue';
import './src/render-map';

export const LtForm = withInstall(form);
export const LtFormItem = withInstall(formItem);
export const LtFormGather = withInstall(formGather);

export * from './src/form';
export * from './src/form-item';
export * from './src/util';
export * from './src/itemInfo';
export * from './src/render';
export * from './src/rules';
