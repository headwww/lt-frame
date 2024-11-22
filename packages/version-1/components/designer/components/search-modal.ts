export interface SearchCondition {
	// id
	id?: string | number;
	// id
	queryUid?: string | number;

	// 脚本或者规则引擎
	type?: 'script' | 'rule';
	// 关联的table
	tUid?: string | number;

	title?: string;

	// type是rule时，规则引擎的配置
	rule?: string;
	// type是script时，脚本的配置
	script?: string;
	// 额外参数数组，配合script使用，当script有特殊占位符?的时候，需要传入额外的参数用作匹配
	extraParams?: any[];
	// 用于判断当前记录是不是新增的 0是常规 1是新增 2是修改
	statue?: number;
}
