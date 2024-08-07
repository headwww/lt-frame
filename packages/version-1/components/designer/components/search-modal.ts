export interface SearchCondition {
	// id
	id?: string | number;
	// id
	queryUid?: string | number;

	// 关联的table
	tUid?: string | number;

	// 脚本或者规则引擎
	type?: 'script' | 'rule';

	title?: string;

	rule?: string;

	script?: string;
	// 0是常规 1是新增 2是修改
	statue?: number;
}
