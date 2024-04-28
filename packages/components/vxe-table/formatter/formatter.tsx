import { VXETable } from 'vxe-table';
import XEUtils from 'xe-utils';

// 保留几位小数、默认两位，和加单位
VXETable.formats.add('$lt-formatter-to-fixed-unit', {
	cellFormatMethod({ cellValue }, digits = 2, unit = '') {
		return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits }) + unit;
	},
});

// 格式化日期默认是yyyy-MM-dd HH:mm:ss
VXETable.formats.add('$lt-formatter-time', {
	cellFormatMethod({ cellValue }, format = 'yyyy-MM-dd HH:mm:ss') {
		return XEUtils.toDateString(cellValue, format);
	},
});

// 格式化枚举
VXETable.formats.add('$lt-formatter-enum', {
	cellFormatMethod({ cellValue }, enumObj = {}) {
		return enumObj[cellValue];
	},
});
