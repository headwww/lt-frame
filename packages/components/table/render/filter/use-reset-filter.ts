import {
	ComparisonOperator,
	FilterConfig,
	LogicalOperators,
	TemporalOperator,
} from './types';

export function useResetFilter() {
	function resetTextFilter(): FilterConfig {
		return {
			logicalOperators: LogicalOperators.AND,
			firstQueryCondition: ComparisonOperator.INCLUDE,
			firstQueryText: '',
			secondQueryCondition: ComparisonOperator.EMPTY,
			secondQueryText: '',
		};
	}
	function resetDateFilter(): FilterConfig {
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
			treeData: [],
			checkedKeys: ['$_SELECT_ALL'],
		};
	}

	return {
		resetTextFilter,
		resetDateFilter,
		resetNumberFilter,
		resetContentFilter,
	};
}
