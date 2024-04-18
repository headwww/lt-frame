import {
	ComparisonOperator,
	FilterData,
	LogicalOperators,
	TemporalOperator,
} from './advanced-filter';

export function useResetFilter() {
	function resetTextFilter(): FilterData {
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		};
	}
	function resetDateFilter(): FilterData {
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: TemporalOperator.EQUALS,
			firstQueryText: '',
			secondQueryCondition: TemporalOperator.EMPTY,
			secondQueryText: '',
		};
	}

	function resetNumberFilter() {
		return resetTextFilter();
	}

	function resetContentFilter() {
		return {
			checkedKeys: ['$_SELECT_ALL'],
		};
	}

	function resetEntityFilter() {
		return {
			records: [],
		};
	}

	return {
		resetEntityFilter,
		resetTextFilter,
		resetDateFilter,
		resetNumberFilter,
		resetContentFilter,
	};
}
