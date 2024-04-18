import { VXETable } from 'vxe-table';
import XEUtils from 'xe-utils';

VXETable.menus.add('$MenusAdd', {
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

VXETable.menus.add('$MenusAddChild', {
	menuMethod(params) {
		console.log('======');

		const { row } = params;
		row.children.push({});
	},
});
