import { ExtractPropTypes } from 'vue';
import arrow from './arrow.vue';
import { iconProps } from '../../icon';

export const arrowProps = {
	...iconProps,
	expand: { type: Boolean },
	up: { type: Boolean },
	down: { type: Boolean },
	inset: { type: Boolean },
};

export type ArrowProps = ExtractPropTypes<typeof arrowProps>;

export type ArrowInstance = InstanceType<typeof arrow>;
