import { PropType } from 'vue';

/**
 * 定义用于类型推断的 prop 类型函数
 * @param val 用于类型推断的值
 * @returns 与输入值类型相同的 prop 类型
 * @example
 * // 使用示例
 * const propValue: string = 'example';
 * const propType: PropType<string> = definePropType(propValue);
 */
export const definePropType = <T>(val: any): PropType<T> => val;
