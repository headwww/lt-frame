export class TransducerManager {
	private transducers: Map<string, (link: string) => string> = new Map();

	// 注册新的转换函数
	register(name: string, fn: (link: string) => string): void {
		if (this.transducers.has(name)) {
			throw new Error(`转换器 "${name}" 已经存在`);
		}
		this.transducers.set(name, fn);
	}

	// 获取转换函数
	get(name: string): ((link: string) => string) | undefined {
		return this.transducers.get(name);
	}

	// 执行转换
	transform(name: string, input: string): string {
		const fn = this.transducers.get(name);
		if (!fn) {
			throw new Error(`转换器 "${name}" 不存在`);
		}
		return fn(input);
	}

	// 移除转换函数
	remove(name: string): boolean {
		return this.transducers.delete(name);
	}

	getTransducers() {
		return this.transducers;
	}

	// 获取所有已注册的转换器名称
	getTransducerNames(): string[] {
		return Array.from(this.transducers.keys());
	}

	// 或者获取所有转换器的键值对
	getAllTransducers(): [string, (link: string) => string][] {
		return Array.from(this.transducers.entries());
	}
}

// 导出单例实例
export const LtLinkTransducer = new TransducerManager();
