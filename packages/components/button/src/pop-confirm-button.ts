import { ExtractPropTypes } from 'vue';
import popConfirmButton from './pop-confirm-button.vue';

export const popConfirmButtonProps = {
	enable: {
		type: Boolean,
		default: true,
	},
};

export type PopConfirmButtonProps = ExtractPropTypes<
	typeof popConfirmButtonProps
>;

export type PopConfirmButtonInstance = InstanceType<typeof popConfirmButton>;
