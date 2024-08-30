import { PropType, VNode } from 'vue';
import { FeatureConfig } from '../../../types';

export interface FeatureMenuEvents {
	code: string | number;
	title: string;
	icon: VNode;
}

export interface FeatureMenuProps {
	edit: Boolean;
	list: Array<FeatureConfig>;
	events?: Array<FeatureMenuEvents>;
}

export const featureMenuProps = {
	edit: {
		type: Boolean,
		required: true,
	},
	list: {
		type: Array as PropType<Array<FeatureConfig>>,
		default: () => [],
	},
	events: {
		type: Array as PropType<Array<FeatureMenuEvents>>,
		required: false,
	},
};
