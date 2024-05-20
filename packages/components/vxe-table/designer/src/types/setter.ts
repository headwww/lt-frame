/**
 * 设置器配置
 */
export interface SetterConfig {
	/**
	 * 配置设置器用哪一个 setter
	 */
	componentName: string;
	/**
	 * 传递给 setter 的属性
	 *
	 * the props pass to Setter Component
	 */
	props?: Record<string, unknown>;

	/**
	 * Setter 的初始值
	 *
	 * @todo initialValue 可能要和 defaultValue 二选一
	 */
	initialValue?: any;

	defaultValue?: any;
}
