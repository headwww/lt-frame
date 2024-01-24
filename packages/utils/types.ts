/**
 * 字符串类型对象
 */
export type Recordable<T = any> = Record<string, T>;

export declare interface Fn<T = any, R = T> {
	(...arg: T[]): R;
}
