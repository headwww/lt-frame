import XEUtils from 'xe-utils';
import { SearchResult } from './types';

class SearchStore {
	private store: any = {};

	has(name: string): boolean {
		return !!this.get(name);
	}

	get(name: string): any {
		return this.store[name];
	}

	add(name: string, render: any): SearchStore {
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

export interface SearchOptions {
	// 分类
	createSearchMethod: (params?: any) => Promise<SearchResult[]>;
}

export interface GlobalSearch {
	has(name: string): boolean;
	get(name: string): SearchOptions;
	add(name: string, options: SearchOptions): GlobalSearch;
	delete(name: string): void;
	getStore(): any;
}

export const LtSuperSearch = new SearchStore() as GlobalSearch;
