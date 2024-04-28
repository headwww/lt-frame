import dayjs from 'dayjs';
import { isUndefined } from 'lodash-es';
import {
	ComparisonOperator,
	FilterData,
	FilterMode,
	LogicalOperators,
	TemporalOperator,
} from './advanced-filter';

/**
 * 比较操作符的运算逻辑
 *
 * @param method
 * @param value1
 * @param value2
 * @returns
 */
export function filterValueMethod(
	method: ComparisonOperator | TemporalOperator,
	value1: string,
	value2: string
) {
	let result = false;
	switch (method) {
		case ComparisonOperator.INCLUDE:
			result = value1.toString().includes(value2);
			break;
		case ComparisonOperator.EXCLUDE:
			result = !value1.toString().includes(value2);
			break;
		case ComparisonOperator.EQUALS:
			result = value1 === value2;
			break;
		case ComparisonOperator.NOT_EQUALS:
			result = value1 !== value2;
			break;
		case ComparisonOperator.GREATER_THAN:
			result = value1 > value2;
			break;
		case ComparisonOperator.GREATER_THAN_OR_EQUAL:
			result = value1 >= value2;
			break;
		case ComparisonOperator.LESS_THAN:
			result = value1 < value2;
			break;
		case ComparisonOperator.LESS_THAN_OR_EQUAL:
			result = value1 <= value2;
			break;
		case ComparisonOperator.STARTS_WITH:
			result = value1.toString().startsWith(value2);
			break;
		case ComparisonOperator.DOES_NOT_START_WITH:
			result = !value1.toString().startsWith(value2);
			break;
		case ComparisonOperator.ENDS_WITH:
			result = value1.toString().endsWith(value2);
			break;
		case ComparisonOperator.DOES_NOT_END_WITH:
			result = !value1.toString().endsWith(value2);
			break;
		default:
			break;
	}
	return result;
}

export function filterDataMethod(
	method: ComparisonOperator | TemporalOperator,
	cellValue: string,
	queryText: string
) {
	let result = false;

	const replaceCellValue = cellValue
		.replace('年', '-')
		.replace('月', '-')
		.replace('日', '')
		.replace('时', ':')
		.replace('分', ':')
		.replace('秒', '');

	const cellTimeStamp = dayjs(replaceCellValue);

	const queryTextTimeStamp = queryText;

	switch (method) {
		case TemporalOperator.EQUALS:
			result = cellTimeStamp.isSame(queryTextTimeStamp);
			break;
		case TemporalOperator.NOT_EQUALS:
			result = !cellTimeStamp.isSame(queryTextTimeStamp);
			break;
		case TemporalOperator.AFTER:
			result = cellTimeStamp.isAfter(queryTextTimeStamp);
			break;
		case TemporalOperator.AFTER_OR_SAME:
			result =
				cellTimeStamp.isAfter(queryTextTimeStamp) ||
				cellTimeStamp.isSame(queryTextTimeStamp);
			break;
		case TemporalOperator.BEFORE:
			result = cellTimeStamp.isBefore(queryTextTimeStamp);
			break;
		case TemporalOperator.BEFORE_OR_SAME:
			result =
				cellTimeStamp.isBefore(queryTextTimeStamp) ||
				cellTimeStamp.isSame(queryTextTimeStamp);
			break;
		default:
			break;
	}
	return result;
}

/**
 *
 * @param filterMode
 * @param cellValue
 * @param compareFilterFormProps
 * @returns
 */
export function compareFilter(
	filterMode: FilterMode,
	cellValue: string,
	filterData: FilterData
): boolean {
	const {
		logicalOperators,
		firstQueryCondition,
		firstQueryText,
		secondQueryCondition,
		secondQueryText,
	} = filterData;

	let firstResult = false;
	let secondResult = false;
	if (filterMode === FilterMode.DATE) {
		firstResult = filterDataMethod(
			firstQueryCondition,
			isUndefined(cellValue) ? '' : cellValue,
			firstQueryText
		);
		secondResult = filterDataMethod(
			secondQueryCondition,
			isUndefined(cellValue) ? '' : cellValue,
			secondQueryText
		);
	} else if (
		filterMode === FilterMode.NUMBER ||
		filterMode === FilterMode.TEXT
	) {
		firstResult = filterValueMethod(
			firstQueryCondition,
			isUndefined(cellValue) ? '' : cellValue,
			firstQueryText
		);
		secondResult = filterValueMethod(
			secondQueryCondition,
			isUndefined(cellValue) ? '' : cellValue,
			secondQueryText
		);
	}
	if (
		secondQueryCondition === ComparisonOperator.EMPTY ||
		secondQueryCondition === TemporalOperator.EMPTY
	) {
		return firstResult;
	}
	return logicalOperators === LogicalOperators.AND
		? firstResult && secondResult
		: firstResult || secondResult;
}
