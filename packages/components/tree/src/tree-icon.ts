import type { VNode } from 'vue';
import { h } from 'vue';
import { isString } from 'lodash-es';
import Icon from '../../icon';

export const TreeIcon = ({ icon }: { icon: VNode | string | undefined }) => {
	if (!icon) return null;
	if (isString(icon)) {
		const mr = {
			marginRight: '8px',
		};
		return h(Icon, { icon, style: mr });
	}
	return h(Icon);
};
