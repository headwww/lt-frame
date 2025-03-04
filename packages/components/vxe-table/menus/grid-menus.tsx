import { VxeUI } from 'vxe-table';
import XEUtils from 'xe-utils';

VxeUI.menus.add('$MenusAdd', {
	menuMethod(params) {
		const { $table } = params;
		if ($table) {
			$table.insert({
				_X_ROW_INSERT: true,
				_X_ROW_ID: XEUtils.uniqueId('$'),
			});
		}
	},
});

VxeUI.menus.add('$MenusAddChild', {
	menuMethod(params) {
		const { row } = params;
		row.children.push({});
	},
});
