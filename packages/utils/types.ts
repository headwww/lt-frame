// 任意类型的记录，键为字符串
export type Recordable<T = any> = Record<string, T>;

// 任意返回 Promise 的函数类型
export type AnyPromiseFunction = (...arg: any[]) => PromiseLike<any>;

// 任意返回非 Promise 的函数类型
export type AnyNormalFunction = (...arg: any[]) => any;

// 任意函数类型，可能返回 Promise 或非 Promise
export type AnyFunction = AnyNormalFunction | AnyPromiseFunction;

// 可为 null 的类型
export type Nullable<T> = T | null;

// 非 null 或 undefined 的类型
export type NonNullable<T> = T extends null | undefined ? never : T;

// 只读的记录类型
export interface ReadonlyRecordable<T = any> {
	readonly [key: string]: T;
}

// setTimeout 返回的类型
export type TimeoutHandle = ReturnType<typeof setTimeout>;

// setInterval 返回的类型
export type IntervalHandle = ReturnType<typeof setInterval>;

// 通用函数接口，接收类型为 T 的参数，返回类型为 R
export interface Fn<T = any, R = T> {
	(...arg: T[]): R;
}
