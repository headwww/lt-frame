import { Fn } from '@lt-frame/utils';
import { ExtractPropTypes, PropType } from 'vue';
import dropdown from './dropdown.vue';

export interface DropMenu {
	onClick?: Fn;
	to?: string;
	icon?: string;
	event: string | number;
	text: string;
	disabled?: boolean;
	divider?: boolean;
}

export const dropdownProps = {
	popconfirm: Boolean,
	trigger: {
		type: Array as PropType<('contextmenu' | 'click' | 'hover')[]>,
		default: () => ['contextmenu'],
	},
	dropMenuList: {
		type: Array as PropType<(DropMenu & Record<string, any>)[]>,
		default: () => [],
	},
	selectedKeys: {
		type: Array as PropType<string[]>,
		default: () => [],
	},
};

export type DropdownProps = ExtractPropTypes<typeof dropdownProps>;

export type DropdownInstance = InstanceType<typeof dropdown>;
