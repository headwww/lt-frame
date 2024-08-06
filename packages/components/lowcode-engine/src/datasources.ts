import XEUtils from 'xe-utils';

class DatasourceStore {
	private store: any = {};

	has(name: string): boolean {
		return !!this.get(name);
	}

	get(name: string): any {
		return this.store[name];
	}

	add(name: string, render: any): DatasourceStore {
		const conf = this.store[name];
		this.store[name] = conf ? XEUtils.merge(conf, render) : render;
		return this;
	}

	delete(name: string): void {
		delete this.store[name];
	}

	getStore() {
		return this.store;
	}
}

interface DatasourceOptions {
	/**
	 * 数据源
	 *
	 * @param params 需要查询的参数
	 * @param expr 查询条件hql
	 * @returns
	 */
	createDatasource: (params?: any, expr?: string) => any;
	/**
	 * 顶级实体，用于设置默认的实体配置的数据源
	 */
	uniqueClasspath?: string;
}

interface GlobalDatasource {
	has(name: string): boolean;
	get(name: string): DatasourceOptions;
	add(name: string, options: DatasourceOptions): GlobalDatasource;
	delete(name: string): void;
	getStore(): any;
}

export const LtDatasource = new DatasourceStore() as GlobalDatasource;
