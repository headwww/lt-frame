import { Fn } from '@lt-frame/utils';
import { PropType } from 'vue';

export interface EventBus {
	[key: string]: Fn;
}
export interface Datasource {
	[key: string]: Fn;
}

export const tableProps = {
	entity: String,
	config: Object as PropType<object>,
	eventBus: {
		type: Object as PropType<EventBus>,
		default: () => ({}),
	},
	datasource: {
		type: Object as PropType<Datasource>,
		default: () => ({}),
	},
};
