import { TableQueryParams } from './table';

/**
 * @deprecated queryParams转换为sql 后期需要优化掉，使用queryParams替代
 * @param value
 */
export function queryParamsParserSql(value?: TableQueryParams) {
	if (!value) {
		return '';
	}
	if (!value?.expression) {
		return '';
	}

	let sql = value.expression;
	const params = value.params || [];

	// 替换问号为对应参数值
	let paramIndex = 0;
	sql = sql.replace(/\?/g, () => {
		const param = params[paramIndex];
		paramIndex++;
		return param?.value?.toString() ?? '?';
	});

	return sql;
}
