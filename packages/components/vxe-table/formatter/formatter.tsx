import { VxeUI } from 'vxe-table';
import XEUtils from 'xe-utils';
import dayjs from 'dayjs';
import { isArray } from '@lt-frame/utils';
import { isNumber } from 'lodash-es';

// 保留几位小数、默认两位，和加单位
VxeUI.formats.add('$lt-formatter-to-fixed-unit', {
	cellFormatMethod({ cellValue }, digits, unit = '') {
		if (digits) {
			if (cellValue || cellValue === 0) {
				return XEUtils.commafy(XEUtils.toNumber(cellValue), { digits }) + unit;
			}
			return cellValue;
		}
		return cellValue;
	},
});

// 格式化日期默认是yyyy-MM-dd HH:mm:ss
VxeUI.formats.add('$lt-formatter-time', {
	cellFormatMethod({ cellValue }, format = 'YYYY-MM-DD HH:mm:ss') {
		if (cellValue) {
			return dayjs(cellValue).format(format);
		}
		return cellValue;
	},
});

// 格式化time 时分秒
VxeUI.formats.add('$lt-formatter-enum-hms', {
	cellFormatMethod({ cellValue }) {
		if (isNumber(cellValue)) {
			return dayjs(cellValue).format('HH:mm:ss');
		}
		return cellValue;
	},
});

// 格式化枚举
VxeUI.formats.add('$lt-formatter-enum', {
	cellFormatMethod({ cellValue }, enumObj = {}) {
		return enumObj[cellValue];
	},
});

// 格式化枚举['$lt-formatter-enum-key-value',[{key:string,value:string},{key:string,value:string}]]
VxeUI.formats.add('$lt-formatter-enum-key-value', {
	cellFormatMethod({ cellValue }, enumArray) {
		if (enumArray && isArray(enumArray)) {
			const obj = enumArray.find((item) => {
				if (item.key) {
					return item.key === cellValue;
				}
				return false;
			});

			if (obj && obj.key) {
				return obj.value;
			}
			return cellValue;
		}
		return cellValue;
	},
});
