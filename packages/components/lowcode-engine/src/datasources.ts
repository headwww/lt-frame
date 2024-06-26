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
	createDatasource: (params?: any) => any;
}

interface GlobalDatasource {
	has(name: string): boolean;
	get(name: string): DatasourceOptions;
	add(name: string, options: DatasourceOptions): GlobalDatasource;
	delete(name: string): void;
	getStore(): any;
}

export const LtDatasource = new DatasourceStore() as GlobalDatasource;
