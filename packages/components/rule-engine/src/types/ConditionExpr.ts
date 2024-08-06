/**
 * 条件表达式
 */
export interface ConditionExpr {
	id?: string | number;

	parentId?: string | number;
	/**
	 * 单个条件或条件组
	 */
	type?: 'single' | 'group';
	/**
	 * 逻辑关系
	 */
	conditionType?: 'AND' | 'OR';
	/**
	 * 子项
	 */
	children?: ConditionExpr[];

	/**
	 * 值
	 */
	params?: { [key: string]: any };

	/**
	 * 额外的参数
	 */
	expr?: { [key: string]: any };
}
