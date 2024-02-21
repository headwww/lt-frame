import { ExtractPropTypes, PropType } from 'vue';
import loadingVue from './loading.vue';

export enum SizeEnum {
	DEFAULT = 'default',
	SMALL = 'small',
	LARGE = 'large',
}

export const loadingProps = {
	tip: {
		type: String as PropType<string>,
		default: '',
	},
	size: {
		type: String as PropType<SizeEnum>,
		default: SizeEnum.LARGE,
		validator: (v: SizeEnum): boolean =>
			[SizeEnum.DEFAULT, SizeEnum.SMALL, SizeEnum.LARGE].includes(v),
	},
	absolute: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
	loading: {
		type: Boolean as PropType<boolean>,
		default: false,
	},
	background: {
		type: String as PropType<string>,
		default: '',
	},
	theme: {
		type: String as PropType<'dark' | 'light'>,
		default: 'light',
	},
};

export type LoadingProps = ExtractPropTypes<typeof loadingProps>;

export type LoadingInstance = InstanceType<typeof loadingVue>;
