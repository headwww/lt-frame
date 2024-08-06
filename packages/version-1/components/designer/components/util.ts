import { ConditionExpr } from '@lt-frame/components';
import dayjs from 'dayjs';
import { get } from 'lodash-es';

export function generateHqlWhereClause(node: ConditionExpr): string {
	if (node.type === 'single') {
		return processSingleNode(node);
	}
	if (node.type === 'group' && node.children) {
		const conditionType = node.conditionType || 'AND';
		const clauses = node.children.map((child) => generateHqlWhereClause(child));
		return `${clauses.join(` ${conditionType} `)}`;
	}
	return '';
}

function processSingleNode(node: ConditionExpr): string {
	if (!node.params) return '';

	const { field, operator, value, not } = node.params;
	let clause: string = '';

	const v =
		get(node, 'params.field.fieldType') === 'java.lang.Boolean' ||
		get(node, 'params.field.fieldType') === 'java.lang.Integer' ||
		get(node, 'params.field.fieldType') === 'java.lang.Long' ||
		get(node, 'params.field.fieldType') === 'java.math.BigDecimal'
			? value
			: `'${value}'`;

	switch (operator) {
		case '等于':
			clause =
				value === null
					? `this.${field.value} IS NULL`
					: `this.${field.value} = ${v}`;
			break;
		case '小于':
			clause = `this.${field.value} < ${v}`;
			break;
		case '小于等于':
			clause = `this.${field.value} <= ${v}`;
			break;
		case '大于':
			clause = `this.${field.value} > ${v}`;
			break;
		case '大于等于':
			clause = `this.${field.value} >= ${v}`;
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
				clause = `(this.${field.value} BETWEEN '${get(value, '0')}' AND '${get(
					value,
					'1'
				)}')`;
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
			switch (value) {
				case '当天':
					clause = `this.${field.value} = CURRENT_DATE`;
					break;
				case '本周':
					clause = `YEARWEEK(this.${field.value}, 1) = YEARWEEK(CURRENT_DATE, 1)`;
					break;
				case '本月':
					clause = `YEAR(this.${field.value}) = YEAR(CURRENT_DATE) AND MONTH(this.${field.value}) = MONTH(CURRENT_DATE)`;
					break;
				case '近两天':
				case '近三天':
				case '一周内':
				case '一月内':
					const presetDate = getPresetDate(value);
					clause = `this.${field.value} >= '${presetDate}'`;
					break;
				default:
					throw new Error(`Unknown preset value: ${value}`);
			}
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

	return clause;
}

function getPresetDate(value: string): Date {
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

	return date.toDate();
}
