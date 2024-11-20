import { ConditionExpr } from '@lt-frame/components';
import dayjs from 'dayjs';
import { get } from 'lodash-es';

export function generateHqlWhereClause(node: ConditionExpr): any {
	if (node.type === 'single') {
		return processSingleNode(node);
	}
	if (node.type === 'group' && node.children) {
		const conditionType = node.conditionType || 'AND';
		const clauseArgs = node.children.map((child) =>
			generateHqlWhereClause(child)
		);
		const clauses = clauseArgs.map((item) => item.clause);
		const mergedArgs: any[] = [];

		// 使用 for 循环遍历 data 数组
		for (let i = 0; i < clauseArgs.length; i++) {
			mergedArgs.push(...clauseArgs[i].args);
		}

		// return `${clauses.join(` ${conditionType} `)}`;
		return {
			clause: `${clauses.join(` ${conditionType} `)}`,
			args: mergedArgs,
		};
	}
	return { clause: '', args: [] };
}

function processSingleNode(node: ConditionExpr): any {
	if (!node.params) return { clause: '', args: [] };

	const { field, operator, value, not } = node.params;
	let clause: string = '';
	let args: any[] = [];

	const v =
		get(node, 'params.field.fieldType') === 'java.lang.Boolean' ||
		get(node, 'params.field.fieldType') === 'java.lang.Integer' ||
		get(node, 'params.field.fieldType') === 'java.lang.Long' ||
		get(node, 'params.field.fieldType') === 'java.math.BigDecimal'
			? value
			: `'${value}'`;

	switch (operator) {
		case '等于':
			// 如果是日期条件 date 型，实际参数带时分秒，等于要改造成起止模式
			if (get(node, 'params.field.fieldType') === 'java.util.Date') {
				if (get(node, 'expr.type') === 'date') {
					if (get(node, 'params.argType') === 'placeHolder') {
						clause = `(this.${field.value} BETWEEN ? AND ?)`;
						args = [
							{ type: 'Date', value: `${value} 00:00:00` },
							{ type: 'Date', value: `${value} 23:59:59` },
						];
					} else {
						clause = `(this.${field.value} BETWEEN '${value} 00:00:00' AND '${value} 23:59:59')`;
					}
				} else {
					if (get(node, 'params.argType') === 'placeHolder') {
						clause =
							value === null
								? `this.${field.value} IS NULL`
								: `this.${field.value} = ?`;
						args = [{ type: 'Date', value: v }];
					} else {
						clause =
							value === null
								? `this.${field.value} IS NULL`
								: `this.${field.value} = ${v}`;
					}
				}
			} else {
				if (get(node, 'params.argType') === 'placeHolder') {
					if (get(node, 'params.field.fieldType') === 'java.util.Date') {
						clause =
							value === null
								? `this.${field.value} IS NULL`
								: `this.${field.value} = ?`;
						args = [{ type: 'Date', value: v }];
					} else {
						clause =
							value === null
								? `this.${field.value} IS NULL`
								: `this.${field.value} = ?`;
						args = [v];
					}
				} else {
					clause =
						value === null
							? `this.${field.value} IS NULL`
							: `this.${field.value} = ${v}`;
				}
			}
			break;
		case '小于':
			if (get(node, 'params.argType') === 'placeHolder') {
				if (get(node, 'params.field.fieldType') === 'java.util.Date') {
					clause = `this.${field.value} < ?`;
					args = [{ type: 'Date', value }];
				} else {
					clause = `this.${field.value} < ?`;
					args = [v];
				}
			} else {
				clause = `this.${field.value} < ${v}`;
			}
			break;
		case '小于等于':
			if (get(node, 'params.argType') === 'placeHolder') {
				if (get(node, 'params.field.fieldType') === 'java.util.Date') {
					clause = `this.${field.value} <=?`;
					args = [{ type: 'Date', value }];
				} else {
					clause = `this.${field.value} <=?`;
					args = [v];
				}
			} else {
				clause = `this.${field.value} <= ${v}`;
			}
			break;
		case '大于':
			if (get(node, 'params.argType') === 'placeHolder') {
				if (get(node, 'params.field.fieldType') === 'java.util.Date') {
					clause = `this.${field.value} >?`;
					args = [{ type: 'Date', value }];
				} else {
					clause = `this.${field.value} >?`;
					args = [v];
				}
			} else {
				clause = `this.${field.value} > ${v}`;
			}
			break;
		case '大于等于':
			if (get(node, 'params.argType') === 'placeHolder') {
				if (get(node, 'params.field.fieldType') === 'java.util.Date') {
					clause = `this.${field.value} >=?`;
					args = [{ type: 'Date', value }];
				} else {
					clause = `this.${field.value} >=?`;
					args = [v];
				}
			} else {
				clause = `this.${field.value} >= ${v}`;
			}
			break;
		case '起止':
			if (
				get(node, 'params.field.fieldType') === 'java.lang.Boolean' ||
				get(node, 'params.field.fieldType') === 'java.lang.Integer' ||
				get(node, 'params.field.fieldType') === 'java.lang.Long' ||
				get(node, 'params.field.fieldType') === 'java.math.BigDecimal'
			) {
				clause = `(this.${field.value} BETWEEN ${get(value, '0')} AND ${get(
					value,
					'1'
				)})`;
			} else {
				if (get(node, 'params.argType') === 'placeHolder') {
					if (get(node, 'params.field.fieldType') === 'java.util.Date') {
						clause = `(this.${field.value} BETWEEN ? AND ?)`;
						args = [
							{ type: 'Date', value: value[0] },
							{ type: 'Date', value: value[1] },
						];
					} else {
						clause = `(this.${field.value} BETWEEN ? AND ?)`;
						args = [value[0], value[1]];
					}
				} else {
					clause = `(this.${field.value} BETWEEN '${get(
						value,
						'0'
					)}' AND '${get(value, '1')}')`;
				}
			}

			break;
		case '开头匹配':
			clause = `this.${field.value} LIKE '${value}%'`;
			break;
		case '末尾匹配':
			clause = `this.${field.value} LIKE '%${value}'`;
			break;
		case '包含':
			clause = `this.${field.value} LIKE '%${value}%'`;
			break;
		case '预设':
			let datestr = '';
			if (value) {
				datestr = getPresetDate(value);
				clause = `this.${field.value} >= ?`;
				args = [{ type: 'Date', value: datestr }];
			}
			// switch (value) {
			// 	case '当天':
			// 		break;
			// 	case '本周':
			// 		// clause = `YEARWEEK(this.${field.value}, 1) = YEARWEEK(CURRENT_DATE, 1)`;
			// 		break;
			// 	case '本月':
			// 		// clause = `YEAR(this.${field.value}) = YEAR(CURRENT_DATE) AND MONTH(this.${field.value}) = MONTH(CURRENT_DATE)`;

			// 		break;
			// 	case '近两天':
			// 	case '近三天':
			// 	case '一周内':
			// 	case '一月内':
			// 		const presetDate = getPresetDate(value);
			// 		clause = `this.${field.value} >= '${presetDate}'`;
			// 		break;
			// 	default:
			// 		throw new Error(`Unknown preset value: ${value}`);
			// }
			break;
		case '为空':
			clause = `this.${field.value} IS NULL`;
			break;
		default:
			clause = `this.${field.value} ${operator} ${v}`;
			break;
	}

	if (not) {
		clause = `NOT (${clause})`;
	}

	return { clause, args };
}

/**
 * 根据预设的值获取日期
 * @param value - 预设的值，可以是 '当天'、'近两天'、'近三天'、'本周'、'一周内'、'本月'、'一月内'
 * @returns 根据预设值计算得到的日期，都从指定日期0点开始，格式为 'YYYY-MM-DD 00:00:00'
 * @throws {Error} 如果传入的预设值不在指定的范围内
 */
function getPresetDate(value: string): string {
	const today = dayjs();
	let date: dayjs.Dayjs;

	switch (value) {
		case '当天':
			date = today;
			break;
		case '近两天':
			date = today.subtract(1, 'day');
			break;
		case '近三天':
			date = today.subtract(2, 'day');
			break;
		case '本周':
			date = today.startOf('week');
			break;
		case '一周内':
			date = today.subtract(6, 'day');
			break;
		case '本月':
			date = today.startOf('month');
			break;
		case '一月内':
			date = today.subtract(30, 'day');
			break;
		default:
			throw new Error(`Unknown preset value: ${value}`);
	}

	return `${date.format('YYYY-MM-DD')} 00:00:00`;
}
