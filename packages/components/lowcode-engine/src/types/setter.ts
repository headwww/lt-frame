/**
 * 设置器配置
 */
export interface SetterConfig {
	/**
	 * 配置设置器用哪一个 setter
	 */
	componentName: string;

	/**
	 *
	 * 传递给 setter 的属性
	 *
	 */
	props?: { [key: string]: any };

	/**
	 * 是否必填？
	 *
	 * ArraySetter 里有个快捷预览，可以在不打开面板的情况下直接编辑
	 */
	isRequired?: boolean;

	/**
	 * Setter 的初始值
	 *
	 * @todo initialValue 可能要和 defaultValue 二选一
	 */
	initialValue?: any | ((target: any) => any);

	defaultValue?: any;
}
